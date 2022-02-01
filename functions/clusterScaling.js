exports = async function(projectId, clusterName){

  const clusterInfo = await context.functions.execute('getClusterState',projectId, clusterName=clusterName);
  
  //no further actions if cluster is paused
  if (clusterInfo.paused) {
    return {'status':200, 'msg':'cluster is paused'}
  }
  
  clusterInfo['metrics'] = await context.functions.execute('getMetrics',projectId,clusterInfo.processes);
  
  const cpuScaleDown = Math.max.apply(Math , clusterInfo.metrics['testcluster-shard-00-00.8o5sy.mongodb.net:27017'].CPU) < 60;
  console.log('result ' + cpuScaleDown);
  return clusterInfo;
};