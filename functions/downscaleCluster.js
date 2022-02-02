exports = async function(projectId,clusterName, clusterInfo){
  
  const clusterList = context.values.get("instanceList");
  console.log('running scale');
  //get the next smaller M-size
  const smallerSize = clusterList[clusterList.indexOf(clusterInfo.currentSize)-1];
  
  let apiCall = await context.functions.execute('getApiTemplate','clusterScale',projectId, clusterName);
  apiCall.body = '{"providerSettings":{"providerName": "'+clusterInfo.providerName+'","instanceSizeName":"'+smallerSize +'"}}';
  apiCall.headers = {"Content-Type":["application/json"]};
  response = await context.http.patch(apiCall);

  return response.statusCode;
};