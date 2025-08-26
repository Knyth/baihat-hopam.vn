// src/app/api/composers/featured/route.js

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Tạm thời lấy một danh sách các tác giả nổi bật theo cách thủ công
    // Trong tương lai có thể dựa vào số lượng bài hát hoặc một trường 'featured'
    const featuredComposerNames = [
      'Trịnh Công Sơn', 'Lam Phương', 'Phạm Duy', 'Văn Cao'
    ];

    const composers = await prisma.composer.findMany({
      where: {
        name: {
          in: featuredComposerNames,
        },
      },
      select: {
        name: true,
        slug: true,
        image_url: true, // Lấy cả ảnh đại diện
      }
    });
    
    return NextResponse.json(composers);

  } catch (error) {
    console.error("Error fetching featured composers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

