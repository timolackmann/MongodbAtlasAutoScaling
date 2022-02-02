exports = async function(projectId, clusterName){

  const thresholds = context.values.get("thresholds");
  const clusterInfo = await context.functions.execute('getClusterState',projectId, clusterName);
  //no further actions if cluster is paused
  if (clusterInfo.paused) {
    return {'status':200, 'msg':'cluster is paused'}
  }
  
  if (clusterInfo.currentSize.indexOf('M') == -1){
    return {'status': 200, 'msg':'cluster is not a M size'}
  }
  
  clusterInfo.metrics = await context.functions.execute('getMetrics',projectId,clusterInfo.processes);
  
  let cpuScaleDown = [];
  for (var process of clusterInfo.processes) {
    cpuScaleDown.push(Math.max.apply(Math , clusterInfo.metrics[process].CPU) < thresholds.CPU);    
  }
  //Ensuring 
  if (cpuScaleDown.every(Boolean) && clusterInfo.currentSize.replace(/[^0-9]/g,'') > 10 && clusterInfo.currentSize.replace(/[^0-9]/g,'') <= 80){
    result = await context.functions.execute('downscaleCluster',projectId,clusterName, clusterInfo);
  }
  return result;
};