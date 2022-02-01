exports = async function(projectId, processes){

  var readings = {};
  for (var process of processes){
    var apiCall = await context.functions.execute('getApiTemplate','metrics',projectId,'', process=process);
    apiCall.query ={
      'period':['P0DT2H'],
      'm':['SYSTEM_MEMORY_USED','MAX_PROCESS_NORMALIZED_CPU_USER'],
      'granularity':['PT5M']
    }
    response = await context.http.get(apiCall);
    const returnBody = EJSON.parse(response.body.text());
    
    for (var measurement of returnBody.measurements){
      readings[process] = measurement;
    }
    
  }
  
  return readings;
};