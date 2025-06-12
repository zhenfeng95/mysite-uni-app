import * as Api from './http';

/**
 * 获取轮播图
 */
export async function getBanners() {
    return await Api.get('/api/banner');
}

/**
 * 获取博客列表数据
 */
export async function getBlogs(data) {
    return await Api.get('/api/blog', data);
}

/**
 * 获取博客分类
 */
export async function getBlogCategories() {
    return await Api.get('/api/blogtype');
}

/**
 * 获取博客详情
 */
export async function getBlog(id) {
    return await Api.get(`/api/blog/${id}`);
}
