import axios from "axios";
import {ElMessage} from "element-plus";

/**
 * ----常量区
 */
const authItemName="access_token"//相当于键值对的键

//----内外通用功能区
//登录
function loginP(email,password,remember,success, failure = defaultFailure) {
    internalPost('/api/auth/login',{
        username: email,
        password: password,
    },{
        'Content-Type': 'application/x-www-form-urlencoded'
    },(data)=>{
        storeAccessToken(remember,data.token,data.expire)
        ElMessage.success(`登陆成功,欢迎${data.username}`)
        success(data)
    },failure)
}
//内外部通用携带请求头的get(2)
function get(url,success,failure=defaultFailure) {
    internalGet(url,accessHeader(),success,failure)
}
//内外部通用携带请求头的post(2)
function post(url,data, success, failure=defaultFailure) {
    internalPost(url,data,accessHeader(),success,failure)
}
//退出登录(2)
function logout(success,failure=defaultFailure) {
    get('api/auth/logout',()=>{
        delAccessToken()
        ElMessage.success('退出登录成功，欢迎再次使用')
        success()
    },failure)
}
//上传文件
function uploadFile(url,data,success,failure=defaultFailure) {
    internalPost(url,data,accessHeader_form_data(),success,failure)
}


//----内部工具方法区
//内部Post（1）
function internalPost(url,data, header, success, failure, error) {
    axios.post(url,data,{headers:header}).then(({data})=>{
        if (data.code===200){
            success(data.data);
        }else {
            failure(data.message,data.code,url);
        }
    }).catch(err=>error(err))
}
//内部get（1）
function internalGet(url, header, success, failure, error) {
    axios.get(url,{headers:header}).then(({data})=>{
        if (data.code===200){
            success(data.data);
        }else {
            failure(data.message,data.code,url);
        }
    }).catch(err=>error(err))
}
//默认失败(1)
const defaultFailure=(message,code,url)=>{
    console.warn(`请求地址:${url},状态码:${code},错误信息${message}`)
    ElMessage.warning(message)
}
//默认异常（1）
const defaultError=(err)=>{
    console.warn(err)
    ElMessage.warning("发送了一些错误，请联系管理员")
}
//保存token(1)
function storeAccessToken(remember,token, expire) {
    const authObj={token:token,expire:expire}
    const str=JSON.stringify(authObj);
    if (remember)
        localStorage.setItem(authItemName,str);
    else
        sessionStorage.setItem(authItemName,str);
}
//删除token(2)
function delAccessToken() {
    localStorage.removeItem(authItemName);
    sessionStorage.removeItem(authItemName);
}
//取出token(2)
function takeAccessToken() {
    const str=localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);
    if (!str) return null;
    const authObj=JSON.parse(str)
    if (authObj.expire <= new Date()){
        delAccessToken()
        ElMessage.warning("已过期")
        return null;
    }
    return authObj.token
}
//获取请求头(2)
function accessHeader() {
    const token=takeAccessToken()
    //判断是否有token
    return token?{'Authorization':`Bearer ${takeAccessToken()}`}:{}
}
//获取请求头(2)+提交类型为表单
function accessHeader_form_data() {
    const token=takeAccessToken()
    return token?{'Authorization':`Bearer ${token}`,'Content-Type': 'multipart/form-data'}:{}
}
//----暴露区
export {
    loginP,
    logout,
    get,
    post,
    uploadFile
}