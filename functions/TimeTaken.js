module.exports= class{
    constructor() {
        this.startTime = Date.now();
        this.extraInfo = null;
    }
    ExtraInfo(i) {
        this.extraInfo = i;
    }
    End() {
        const endTime = Date.now();

        return {
            ms: endTime - this.startTime,
            s: (endTime - this.startTime) / 1000
        }
    }
}