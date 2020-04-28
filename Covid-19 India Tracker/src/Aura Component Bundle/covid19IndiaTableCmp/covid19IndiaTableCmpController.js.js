({
    doInit : function(component, event, helper) {
        var now = new Date();
        component.set("v.currentDateTime",now);
        var action = component.get("c.getResponseFromCovid19");
        action.setCallback(this, function(a){
            var raw_response = a.getReturnValue();
            var response = JSON.parse(raw_response); 
            console.log('---Print Response---',response);
            //variables for total cases accross nation
            var total_confirmed = 0;
            var total_active = 0;
            var total_recovered = 0;
            var total_deceased = 0;
            
            //variables for total increased cases accross nation
            var total_delta_confirmed = 0;
            var total_delta_recovered = 0;
            var total_delta_deceased = 0;
            
            var info = response[0]["info"];
            
            for(var inf1 in info){
                
                var state_confirmed = 0;
                var state_active = 0;
                var state_recovered = 0;
                var state_deceased = 0;
                
                var state_delta_confirmed = 0;
                var state_delta_recovered = 0;
                var state_delta_deceased = 0;
                
                for(var inf2 in info[inf1].districtData){
                    //calculate national level total information
                    total_confirmed += info[inf1].districtData[inf2].confirmed;
                    total_active += info[inf1].districtData[inf2].active;
                    total_recovered += info[inf1].districtData[inf2].recovered;
                    total_deceased += info[inf1].districtData[inf2].deceased;
                    //calculate state level total information
                    state_confirmed += info[inf1].districtData[inf2].confirmed;
                    state_active += info[inf1].districtData[inf2].active;
                    state_recovered += info[inf1].districtData[inf2].recovered;
                    state_deceased += info[inf1].districtData[inf2].deceased;
                    //calculate national level delta information
                    total_delta_confirmed += info[inf1].districtData[inf2].delta.confirmed;
                    total_delta_recovered += info[inf1].districtData[inf2].delta.recovered;
                    total_delta_deceased += info[inf1].districtData[inf2].delta.deceased;
                    //calculate state level delta information
                    state_delta_confirmed += info[inf1].districtData[inf2].delta.confirmed;
                    state_delta_recovered += info[inf1].districtData[inf2].delta.recovered;
                    state_delta_deceased += info[inf1].districtData[inf2].delta.deceased;
                    
                }
                info[inf1].confirmed = state_confirmed;
                info[inf1].active = state_active;
                info[inf1].recovered = state_recovered;
                info[inf1].deceased = state_deceased;
                info[inf1].delta_confirmed = state_delta_confirmed;
                info[inf1].delta_recovered = state_delta_recovered;
                info[inf1].delta_deceased = state_delta_deceased;
            }
            component.set("v.total_confirmed",total_confirmed);
            component.set("v.total_active",total_active);
            component.set("v.total_recovered",total_recovered);
            component.set("v.total_deceased",total_deceased); 
            
            component.set("v.delta_confirmed",total_delta_confirmed);
            component.set("v.delta_recovered",total_delta_recovered);
            component.set("v.delta_deceased",total_delta_deceased);
            
            console.log('---Final Object---',info);
            info.sort(function(a, b){
                return b.confirmed-a.confirmed
            })
            component.set("v.raw_data", info);
            component.set("v.showSpinner",false);
        });
        $A.enqueueAction(action);        
    },
    
    toggle : function(component,event,helper){
        var raw_data = component.get("v.raw_data"), index = event.getSource().get("v.value");
        raw_data[index].expanded = !raw_data[index].expanded;
        component.set("v.raw_data", raw_data);
    },
    
})