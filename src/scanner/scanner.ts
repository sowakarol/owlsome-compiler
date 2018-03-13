

export class Scanner{
    private index:number = 0;
    
    constructor(private text :string){

    }


    next():string{
        return this.text[this.index++];
    }



}