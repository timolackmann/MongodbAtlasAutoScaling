exports = async function(projectId, clusterName){

  const clusterInfo = await context.functions.execute('getClusterState',projectId, clusterName=clusterName);
  
  //no further actions if cluster is paused
  if (clusterInfo.paused) {
    return {'status':200, 'msg':'cluster is paused'}
  }
  return clusterInfo.paused;
};