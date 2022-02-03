exports = async function(projectId, clusterName){

  const thresholds = context.values.get("thresholds");
  const instanceResources = context.values.get("instanceResourceList");
  const clusterInfo = await context.functions.execute('getClusterState',projectId, clusterName);
  //no further actions if cluster is paused
  if (clusterInfo.paused) {
    return {'status':200, 'msg':'cluster is paused'}
  }
  
  if (clusterInfo.currentSize.indexOf('M') == -1){
    return {'status': 200, 'msg':'cluster is not a M size'};
  }
  
  clusterInfo.metrics = await context.functions.execute('getMetrics',projectId,clusterInfo.processes);
  
  let cpuScaleDown = [];
  let memoryScaleDown = [];
  
  for (var process of clusterInfo.processes) {
    cpuScaleDown.push(Math.max.apply(Math , clusterInfo.metrics[process].CPU) < thresholds.CPU);
    memoryScaleDown.push(Math.max.apply(Math, clusterInfo.metrics[process].Memory)/instanceResources[clusterInfo.currentSize].RAM *100 < thresholds.Memory  );

  }
  
  //if thresholds are met ensure that instance is between M20 and M80 and not at the minimum scaling size before scaling down
  if (cpuScaleDown.every(Boolean) && memoryScaleDown.every(Boolean)){
    if (clusterInfo.currentSize.replace(/[^0-9]/g,'') <= 10) {
      return {'status':200, 'msg':'current instance size of cluster '+clusterName+ ' is M10 or smaller'};
    }
    if (clusterInfo.currentSize.replace(/[^0-9]/g,'') > 80){
      return {'status':200, 'msg': 'current instance size of cluster '+clusterName+ ' larger than M80'};   
    }
    if (clusterInfo.scaleConfig.scaleDownEnabled && clusterInfo.currentSize == clusterInfo.scaleConfig.minInstanceSize){
      return {'status':200, 'msg': 'cluster '+clusterName+ ' is already at minimum size'};
    }
    response = await context.functions.execute('downscaleCluster',projectId,clusterName, clusterInfo);

    return {'status':200, 'msg': 'cluster '+clusterName+' has been scaled down'};

  }

  return {'status':200, 'msg': 'cluster not eligible for scaling'};
};