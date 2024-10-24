console.log("Auth.js start"); // 输出日志，表示 Auth.js 文件开始执行

// 导入所需的模块
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase 客户端
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// 登录函数
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) throw error
  return data
}

// 注册函数
export async function signUp(email, password) {
  console.log("开始注册流程"); // 添加日志

  // 参数验证
  if (!email || !password) {
    console.error("注册失败：邮箱或密码为空");
    throw new Error("邮箱和密码不能为空");
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      console.error("注册失败：", error.message);
      throw error;
    }

    console.log("注册成功：", data);
    return { success: true, data: data };
  } catch (error) {
    console.error("注册过程中发生错误：", error.message);
    return { success: false, error: error.message };
  }
}

// 登出函数
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// 获取当前用户函数
export function getUser() {
  return supabase.auth.getUser()
}

// 获取会话函数
export function getSession() {
  return supabase.auth.getSession()
}

console.log("Auth.js end"); // 输出日志，表示 Auth.js 文件执行结束
