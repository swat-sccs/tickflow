'use server'

import {prisma} from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(formData: FormData){
    const slug = formData.get('slug') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    await prisma.project.create({
        data: {
            slug,
            title,
            description,
        }
    })
    console.log(slug, title, description)
    revalidatePath('/projects')
    redirect('/projects')
}
