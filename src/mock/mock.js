import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  LoginUsers,
  Users,
  ArticleList
} from './data/articleList';
let mockArtcles = ArticleList;
export default {
  bootstrap() {
    let mock = new MockAdapter(axios);
    //获取用户列表（分页）
    mock.onPost('/article/list').reply(config => {

      let {
        PageIndex,
        PageSize
      } = JSON.parse(config.data);

      let Total = mockArtcles.length;
      console.log('pageIndex', config.data, PageIndex);
      mockArtcles = mockArtcles.filter((u, index) => index < 20 * PageIndex && index >= 20 * (PageIndex - 1));
      console.log('pageIndex', mockArtcles);

      let Pagination = {
        PageIndex,
        PageSize,
        Total
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            Code: 0,
            Data: mockArtcles,
            Pagination
          }]);
        }, 1000);
      });
    });

  }
}
