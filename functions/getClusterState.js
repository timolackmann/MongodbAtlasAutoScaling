exports = async function(projectId, clusterName){

  const apiCall = await context.functions.execute('getApiTemplate','clusterInfo',projectId, clusterName=clusterName);
  response = await context.http.get(apiCall);
  const returnBody = EJSON.parse(response.body.text());
  //get all processes by splitting the standard connection string
  const processes = returnBody.connectionStrings.standard.substring(returnBody.connectionStrings.standard.indexOf(":")+3,returnBody.connectionStrings.standard.indexOf("/?")).split(",");

  const autoScaling = returnBody.replicationSpecs[0].regionConfigs[0].autoScaling.compute;
  const currentSize = returnBody.replicationSpecs[0].regionConfigs[0].electableSpecs.instanceSize;
  
  return {"processes":processes,"paused":returnBody.paused,'scaleConfig':autoScaling, 'currentSize':currentSize};
};