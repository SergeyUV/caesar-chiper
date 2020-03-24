
const parseArgs = require('minimist');


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
        }else if (typeof this.argv.o == 'string'){
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

    actionDo: function(){
        console.log("Out file: " + this.outFilename + " " + typeof this.outFilename + " to stdout " + this.outToStdOut );
        console.log("In file: " + this.inFilename + " " + typeof this.inFilename + " to stdout " + this.inFromStdIn );
        return this[this.action]();
    },
    
    encodeAction: function(){
        console.log('Do encode' + ' shift ' + this.shift);
        
    },
    
    decodeAction: function(){
        console.log('Do decode' + ' shift ' + this.shift);
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

caesarChiper.actionDo();
