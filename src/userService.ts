module catHacklic {
  export var Paths = {
    userinfo: 'v1.userinfo',
    common: 'v1.commonItems'
  }

  export class UserSerivce {
    public static $inject = [];

    private _userInfo: catHacklic.v1.userInfo;
    constructor() {
      this._userInfo = JSON.parse(localStorage['v1.userinfo'] || "{}");
    }

    public get user(): catHacklic.v1.userInfo { return this._userInfo; }
    public set user(user: catHacklic.v1.userInfo) {
      localStorage[Paths.userinfo] = JSON.stringify(user);
      this._userInfo = user;
    }
  }
}
angular.module('catHacklic')
  .service('UserSerivce', catHacklic.UserSerivce);
