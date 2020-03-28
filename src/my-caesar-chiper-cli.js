
const parseArgs = require('minimist');
const fs = require('fs');
const process = require('process');
const { pipeline } = require('stream');
const through2 = require('through2');

const caesarChiper = {
    
    optAliases: {
        s: 'shift',
        a: 'action',
        i: 'input',
        o: 'output'
    },
    
    init: function(argv) {

        this.argv = parseArgs(argv.slice(2),{alias: this.optAliases});
        
        if( typeof this.argv.s != 'number' || typeof this.argv.a != 'string'){
            this.error = "Argument error";
            return false;
        }
        
        //shift
        if( this.argv.s <= 0 ){
            this.error = "Argument error";
            return false;
        } else{
            this.shift = this.argv.s;
        }
        
        //action
        if( !(this.argv.a + 'Action' in this) ){
            this.error = "Argument error";
            return false;
        }else{
         this.action = this.argv.a + 'Action';   
        }

        // output file arg check
        if(typeof this.argv.o == 'undefined'){
            this.outToStdOut = true;
        }else if (typeof this.argv.o == 'string'){
            this.outToStdOut = false;
            this.outFilename = this.argv.o; 
        }
        else if(typeof this.argv.o == 'number') {
            this.outToStdOut = false;
            this.outFilename = this.argv.o.toString(); 
        }
        else{
            this.error = "Argument error";
            return false;
        }
        
        // input file arg check
        if(typeof this.argv.i == 'undefined'){
            this.inFromStdIn = true;
        }else if (typeof this.argv.i == 'string'){
            this.inFromStdIn = false;
            this.inFilename = this.argv.i; 
        }
        else if(typeof this.argv.i == 'number') {
            this.inFromStdIn = false;
            this.inFilename = this.argv.i.toString(); 
        }
        else{
            this.error = "Argument error";
            return false;
        }
        this.error = null;
    return true;
    },

    openReadStream: function(){
        let readStream;
        
        if(this.inFromStdIn){
            readStream = process.stdin;
        }else{
            let stat;
            try{
                stat = fs.statSync(this.inFilename);
            }
            catch(err){
                console.log(err.toString());
                return undefined;
            }
            
            if(! stat.isFile()){
                console.log('Error: ' + this.inFilename + ' is not a file');
                return undefined;
            }
            readStream = fs.createReadStream(this.inFilename);        
        }
    return readStream;
    },

    openWriteStream: function(){
        let writeStream;
        
        if(this.outToStdOut){
            writeStream = process.stdout;
        }else{
            let stat;
            try{
                stat = fs.statSync(this.outFilename);
            }
            catch(err){
                
            }
            
            if( stat != undefined && stat.isDirectory()){
                console.log('Error: ' + this.outFilename + ' is not a file');
                return undefined;
            }
            writeStream = fs.createWriteStream(this.outFilename);        
        }
    return writeStream;
    },

    actionDo: function(){
        
        let readStream = this.openReadStream();
        if(readStream == undefined){
            return false;
        }
        
        let writeStream = this.openWriteStream();
        if(writeStream == undefined){
            return false;
        }
        
        let ret = true;
        this.error = null;

        pipeline(
            readStream,
            through2(this[this.action]),
            writeStream,
            (err)=>{
                if(err){
                    this.error = err;
                    ret = false;
                    console.log("Data transfer error");
                    return false;
                }else{
                    return true;
                }
            }
        )
        console.log(ret);
        return ret;//this[this.action]();
    },
    
    encodeAction: function(chunk, enc, callback){
        
        console.log('Do encode' + ' shift ' + this.shift);
        
        this.push(chunk);
        callback();

        
    },
    
    decodeAction: function(chunk, enc, callback){
        console.log('Do decode' + ' shift ' + this.shift);
        
        this.push(chunk);
        callback();
        
    },
    
    printUsageToConsole: function() {
        const usageMessage = 'Usage: my-caesar-chiper-cli --action <encode|decode> --shift <number> --input <input_fie_name> --output <output_fie_name>';
        console.log(usageMessage);
    }
}


if( ! caesarChiper.init(process.argv) ){
    caesarChiper.printUsageToConsole();
    process.exit(1);
}

if(! caesarChiper.actionDo()){
    caesarChiper.printUsageToConsole();
    process.exit(2);
}
