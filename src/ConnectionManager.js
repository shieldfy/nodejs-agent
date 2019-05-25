var Rules = require('./rules');
var Logger = require('./Logger');

function Connector(Agent)
{
    this._agent = Agent;
    this._interval = 10000; //suppose to be 1 minute interval (1440 call / day)
}

Connector.prototype.start = function()
{
    this.call();
}

Connector.prototype.call = function()
{
    //return;
    Logger.raw('-> Calling the API');
    var self = this;
    this._agent.http.trigger('/update',{},function(data){
        if(data.status == 'success'){
            //console.log('rulesX',data.rules);
            // console.log('rulesXX',new Rules(data.rules));
            self._agent.rules = new Rules(data.rules);
            Logger.raw('rules updated successfully');
            //console.log(x);
        }
        //console.log(data);
    });

    this.scheduleNextcall();
}

Connector.prototype.scheduleNextcall = function()
{
    var self = this;
    setTimeout(function(){
        self.call();
    },this._interval);
}


module.exports = function(Agent){
    return new Connector(Agent)
};