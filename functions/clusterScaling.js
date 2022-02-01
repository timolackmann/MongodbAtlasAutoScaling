exports = async function(projectId, clusterName){

  const clusterInfo = await context.functions.execute('getClusterState',projectId, clusterName=clusterName);
  
  //no further actions if cluster is paused
  if (clusterInfo.paused) {
    return {'status':200, 'msg':'cluster is paused'}
  }
  
  for (var process in clusterInfo.processes){
    clusterInfo['metrics'][process] = await context.functions.execute('getMetrics',projectId,process);
  }
  
  return clusterInfo.paused;
};