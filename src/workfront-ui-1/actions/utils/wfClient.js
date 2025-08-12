const axios = require("axios");
//const { Core } = require('@adobe/aio-sdk')

class WorkfrontServiceClient {
  
  constructor(baseURL, imsToken) {
    //this.logger = Core.Logger('main', { level: envParams.LOG_LEVEL || 'info' })
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      headers: {'Authorization': `Bearer ${imsToken}`}
    });
  }

  async request(requestObj) {
    if(requestObj.method !== 'search') {
      const method = requestObj.method.toLowerCase();
      const url = `/${requestObj.objCode}${requestObj.ID ? `/${requestObj.ID}` : ''}`;
      const body = requestObj.body ? requestObj.body : {};
      const parameters = requestObj.parameters ? requestObj.parameters : {};

      const response = await this.axiosInstance.request({
        method: method,
        url: url,
        body: body,
        params: parameters
      });
      return response.data.data;
    } else if(requestObj.method == 'search') {
      const method = 'get';
      const countUrl = `/${requestObj.objCode}/count`;
      const searchUrl = `/${requestObj.objCode}/search`;
      const parameters = requestObj.parameters ? requestObj.parameters : {};
      if(!parameters['$$LIIMIT'] || parameters['$$LIMIT'] > 2000) {
        parameters['$$LIMIT'] = 2000;
      }
      const countResponse = await this.axiosInstance.request({
        method: method,
        url: countUrl,
        params: parameters
      });
      const countTotal = countResponse.data;
      let totalResponse = [];
      if(countTotal.data.count > 2000) {
        let retrieved = 0;
        while(retrieved < countTotal.data.count) {
          parameters['$$FIRST'] = retrieved;
          const paginatedResponse = await this.axiosInstance.request({
            method: method,
            url: searchUrl,
            params: parameters
          });
          totalResponse = totalResponse.concat(paginatedResponse.data.data);
          retrieved = totalResponse.length;
        }
      } else {
        const resp = await this.axiosInstance.request({
          method: method,
          url: searchUrl,
          params: parameters
        });
        totalResponse = resp.data.data;
      }
      return totalResponse;
    }
  }
}

module.exports = { WorkfrontServiceClient };