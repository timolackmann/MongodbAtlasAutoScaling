exports = async function(projectId, processes){

  var readings = {};
  for (var process of processes){
    var apiCall = await context.functions.execute('getApiTemplate','metrics',projectId,'', process=process);
    apiCall.query ={
      'period':['P0DT2H'],
      'm':['MAX_PROCESS_NORMALIZED_CPU_USER'],
      'granularity':['PT5M']
    }
    response = await context.http.get(apiCall);
    const returnBody = EJSON.parse(response.body.text());
    
    readings[process] = {'CPU':returnBody.measurements[0].dataPoints.map(({ value }) => value)};
  }
  for (var process of processes){
    var apiCall = await context.functions.execute('getApiTemplate','metrics',projectId,'', process=process);
    apiCall.query ={
      'period':['P0DT2H'],
      'm':['SYSTEM_MEMORY_USED'],
      'granularity':['PT5M']
    }
    response = await context.http.get(apiCall);
    const returnBody = EJSON.parse(response.body.text());
    
    readings[process]['Memory'] = returnBody.measurements[0].dataPoints.map(({ value }) => value);
  }
  
  return readings;
};