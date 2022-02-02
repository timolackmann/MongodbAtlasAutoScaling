exports = async function(projectId,clusterName, clusterInfo){
  
  const clusterList = context.values.get("clusterList");
  
  //get the next smaller M-size
  const smallerSize = clusterList[clusterList.indexOf(clusterInfo.currentSize)-1];
  
  let apiCall = await context.functions.execute('getApiTemplate','clusterScale',projectId, clusterName);
  apiCall.body = '{"providerSettings":{"instanceSizeName": smallerSize}}';
  apiCall.headers = {'Content-Type':['application/json']}
  response = await context.http.patch(apiCall);
  console.log(EJSON.parse(response.body.text()));
  
  
  return true;
};