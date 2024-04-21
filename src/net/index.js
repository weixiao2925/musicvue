import axios from "axios";
import {ElMessage} from "element-plus";
//----常量区
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
        success()
    },failure)
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

//----暴露区
export {
    loginP,
}