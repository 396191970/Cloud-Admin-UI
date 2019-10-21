import fetch from 'utils/fetch';

export function page(query) {
return fetch({
url: '/api/partner/balanceList/page',
method: 'get',
params: query
});
}

export function addObj(obj) {
return fetch({
url: '/api/partner/balanceList',
method: 'post',
data: obj
});
}

export function getObj(id) {
return fetch({
url: '/api/partner/balanceList/' + id,
method: 'get'
})
}

export function delObj(id) {
return fetch({
url: '/api/partner/balanceList/' + id,
method: 'delete'
})
}

export function putObj(id, obj) {
return fetch({
url: '/api/partner/balanceList/' + id,
method: 'put',
data: obj
})
}
