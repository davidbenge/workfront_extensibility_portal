import axios from "axios";
//const { Core } = require('@adobe/aio-sdk')

class WorkfrontServiceClient {
  
  constructor(imsToken) {
    //this.logger = Core.Logger('main', { level: envParams.LOG_LEVEL || 'info' })
    this.apiUrl = `https://bilbroug.my.workfront.adobe.com/attask/api/v20.0`
    this.axiosInstance = axios.create();
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${imsToken}`;
  }

  /* Not Needed for now
  static async create(imsToken) {
    const instance = new WorkfrontServiceClient();
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${imsToken}`;
    //await instance._init(imsToken);
    return instance;
  }

  
  async _init(imsToken) {
    await this._refreshToken(imsToken);
  }

  async _refreshToken(imsToken) {
    const imsUrl = `https://ims-na1.adobelogin.com/ims/token/v3`;
    const response = await this.axiosInstance.post(imsUrl, new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: envParams.clientId,
        client_secret: envParams.clientSecret,
        scope: envParams.clientScopes
    }), {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    this.tokenExpiry = Date.now() / 1000 + response.data.expires_in;
    this.access_token = response.data.access_token;
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access_token}`;
  }

  async _checkTokenValidity(envParams) {
    if (Date.now() / 1000 >= this.tokenExpiry) {
      await this._refreshToken(envParams);
    }
  }
  */

  async get(obj, params = {}) {
    const url = `${this.apiUrl}/${obj.objCode}/${obj.ID}`;
    const response = await this.axiosInstance.get(url, { params });
    return response.data.data;
  }

  async query(obj, params = {}) {
    const url = `${this.apiUrl}/${obj.objCode}`;
    const response = await this.axiosInstance.get(url, { params });
    return response.data.data;
  }

  async post(objCode, obj, params = {}) {
    await this._checkTokenValidity();
    const url = `${this.apiUrl}/${objCode}`;
    const response = await this.axiosInstance.post(url, obj, { params });
    return response.data.data;
  }

  async put(objCode, obj, params = {}) {
    await this._checkTokenValidity();
    const url = `${this.apiUrl}/${objCode}/${obj.ID}`;
    const response = await this.axiosInstance.put(url, obj, { params });
    return response.data.data;
  }

  async delete(objCode, objID) {
    await this._checkTokenValidity();
    const url = `${this.apiUrl}/${objCode}/${objID}`;
    const response = await this.axiosInstance.delete(url);
    return response.data.data;
  }

  async search(objCode, filters, params = {}, envParams) {
    await this._checkTokenValidity(envParams);
    if (!filters['$$LIMIT'] || filters['$$LIMIT'] > 2000) {
      filters['$$LIMIT'] = 2000;
    }
    const countUrl = `${this.apiUrl}/${objCode}/count`;
    const countResponse = await this.axiosInstance.get(countUrl, { params: filters });
    const countTotal = countResponse.data;
    let totalResponse = [];
    if (countTotal.data.count > 2000) {
      let retrieved = 0;
      while (retrieved < countTotal.data.count) {
        filters['$$FIRST'] = retrieved;
        const paginatedResponse = await this.axiosInstance.get(
          `${this.apiUrl}/${objCode}/search`,
          { params: filters }
        );
        totalResponse = totalResponse.concat(paginatedResponse.data.data);
        retrieved = totalResponse.length;
      }
    } else {
      const resp = await this.axiosInstance.get(
        `${this.apiUrl}/${objCode}/search`,
        { params: filters }
      );
      totalResponse = resp.data.data;
    }
    return totalResponse;
  }
}

module.exports = { WorkfrontServiceClient };