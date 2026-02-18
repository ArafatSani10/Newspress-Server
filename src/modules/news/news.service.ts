import { prisma } from "../../lib/prisma.js";

const createNews = async (data: any, authorId: string) => {
    const baseSlug = data.title
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, "-") // সব স্পেস এবং আন্ডারস্কোরকে হাইফেন করবে
        .replace(/[^\u0980-\u09FFa-z0-9-]/g, "") // বাংলা (\u0980-\u09FF) এবং ইংরেজি ব্যতিত সব স্পেশাল ক্যারেক্টার মুছবে
        .replace(/-+/g, "-") // ডাবল হাইফেন থাকলে সিঙ্গেল করবে
        .replace(/^-+|-+$/g, ""); // শুরুতে বা শেষে হাইফেন থাকলে মুছবে

    const slug = `${baseSlug}-${Date.now()}`;

    return await prisma.post.create({
        data: {
            ...data,
            slug,
            authorId,
        },
    });
};

const getAllNews = async () => {
    return await prisma.post.findMany({
        include: {
            category: { select: { name: true, slug: true } },
            author: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getNewsBySlug = async (slug: string) => {
    try {
        const result = await prisma.post.update({
            where: { slug },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
            include: {
                category: true,
                author: { select: { name: true, image: true } },
                comments: {
                    include: {
                        user: { select: { name: true, image: true } },
                    },
                },
            },
        });
        return result;
    } catch (error) {
        return await prisma.post.findUnique({
            where: { slug },
            include: {
                category: true,
                author: { select: { name: true, image: true } },
                comments: {
                    include: {
                        user: { select: { name: true, image: true } },
                    },
                },
            },
        });
    }
};

const updateNews = async (id: string, data: any) => {
    let updateData = { ...data };
    
    if (data.title) {
        updateData.slug = data.title
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    return await prisma.post.update({
        where: { id },
        data: updateData,
    });
};

const deleteNews = async (id: string) => {
    return await prisma.post.delete({
        where: { id },
    });
};

export const NewsService = {
    createNews,
    getAllNews,
    getNewsBySlug,
    updateNews,
    deleteNews,
};