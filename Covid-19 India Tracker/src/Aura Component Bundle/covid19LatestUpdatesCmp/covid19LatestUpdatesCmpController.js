({
    doInit : function(component, event, helper) {
        var mlist = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        var currentDate = new Date();
        var today = currentDate.getDate() + ' ' +  mlist[currentDate.getMonth()];
        component.set('v.currentDay',today);
        
    },
    
    fetchLatestUpdates : function(component, event, helper) {
        var action = component.get('c.getLatestUpdatesFromCovid19');
        action.setCallback(this, function(a){
            var req_response = [];
            var raw_response = JSON.parse(a.getReturnValue());
            raw_response.reverse();
            console.log('Raw Response:::',raw_response);
            var currentDate = new Date();
            for(var up0 in raw_response){
                var activityDate = new Date(raw_response[up0].timestamp * 1000);
                if(currentDate.getDate() == activityDate.getDate()){
                    var updateObj = raw_response[up0].update.split('\n');
                    for(var up in updateObj){
                        if(updateObj[up].length > 0){
                            var time_words = '';
                            var diff = (currentDate.getTime() - (raw_response[up0].timestamp * 1000)) / 1000;
                            diff /= 60;
                            var time = Math.abs(Math.round(diff));
                            console.log('---Each Time---',time);
                            if(time == 1){
                                time_words += time + ' minute ago';
                            }
                            else if(time < 60){
                                time_words += time + ' minutes ago';
                            }
                            else if(Math.abs(Math.round(time/60)) == 1){
                                 time_words += Math.abs(Math.round(time/60))  + ' hour ago'; 
                           	}
                            else if(Math.abs(Math.round(time/60)) > 1){
                                 time_words += Math.abs(Math.round(time/60))  + ' hours ago'; 
                           	}
                            req_response.push({update: updateObj[up], timestamp: time_words});
                        }                    	    
                    }
                }
            }
            var test_req = req_response.slice(0,8);
            console.log('---Final Update---',test_req);
            component.set('v.raw_data',test_req);
        });
        $A.enqueueAction(action); 
    }
})