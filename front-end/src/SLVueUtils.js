

var downloadJson = function(object, fileName){
    const data = JSON.stringify(object);
    const blob = new Blob([data], {type: 'text/plain'});
    const e = document.createEvent('MouseEvents');
    const a = document.createElement('a');
    a.download = fileName + '.json';
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}


module.exports = {
	downloadJson
}