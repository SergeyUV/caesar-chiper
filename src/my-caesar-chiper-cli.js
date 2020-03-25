
const parseArgs = require('minimist');
const fs = require('fs');
const process = require('process');

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
            return false;
        }
        
        //shift
        if( this.argv.s <= 0 ){
            return false;
        } else{
            this.shift = this.argv.s;
        }
        
        //action
        if( !(this.argv.a + 'Action' in this) ){
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
            return false;
        }

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
        console.log("Out file: " + this.outFilename + " " + typeof this.outFilename + " to stdout " + this.outToStdOut );
        console.log("In file: " + this.inFilename + " " + typeof this.inFilename + " from stdin " + this.inFromStdIn );
        
        let readStream = this.openReadStream();
        if(readStream == undefined){
            return false;
        }
        
        let writeStream = this.openWriteStream();
        if(writeStream == undefined){
            return false;
        }
        
        //console.log(readStream + ' -- ' + typeof readStream);
        //console.log(writeStream + ' -- ' + typeof writeStream);
        
        readStream.pipe(writeStream);
        
        return this[this.action]();
    },
    
    encodeAction: function(){
        console.log('Do encode' + ' shift ' + this.shift);
        
        return true;
    },
    
    decodeAction: function(){
        console.log('Do decode' + ' shift ' + this.shift);

        return true;
    },
    
    printUsageToConsole: function() {
        const usageMessage = 'Usage: my-caesar-chiper-cli --action <encode|decode> --shift <number> --input <input_fie_name> --output <output_fie_name>';
        console.log(usageMessage);
    }
}

//console.log(process.argv);

if( ! caesarChiper.init(process.argv) ){
    caesarChiper.printUsageToConsole();
    process.exit(1);
}

if(! caesarChiper.actionDo()){
    caesarChiper.printUsageToConsole();
    process.exit(2);
}
