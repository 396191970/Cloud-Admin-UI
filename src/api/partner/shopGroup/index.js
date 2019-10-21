import fetch from 'utils/fetch';

export function page(query) {
  return fetch({
    url: '/api/partner/shopGroup/page',
    method: 'get',
    params: query
  });
}

export function addObj(obj) {
  return fetch({
    url: '/api/partner/shopGroup',
    method: 'post',
    data: obj
  });
}

export function getObj(id) {
  return fetch({
    url: '/api/partner/shopGroup/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/api/partner/shopGroup/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/api/partner/shopGroup/' + id,
    method: 'put',
    data: obj
  })
}
