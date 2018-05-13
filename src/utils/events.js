export default class {
    
    constructor() {
      this.topics = {};
      this.hOP = this.topics.hasOwnProperty;
      
    }
    
    subscribe(topic, listener) {
      // crate the topic's opbject if not yet created
      if(!this.hOP.call(this.topics, topic)) this.topics[topic] = [];
      
      // add the listener to queue
      var index = this.topics[topic].push(listener) - 1;
      
      // provide handle back for removal of topic
      return {
        remove : function() {
          delete this.topics[topic][index];
        }
      }
    }
    
    publish(topic, info) {
      // if the topic doesn't exist, or there's no listeners in queue, just leave
      if(!this.hOP.call(this.topics, topic)) return;
      
      // cycle through topics queue, fire!
      this.topics[topic].forEach((item) => {
        item(info != undefined ? info : {});
      });
    }
}