'use server'

import {prisma} from '@/lib/prisma'
import { Priority, Status } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTask(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string | null
    const priority = formData.get('priority') as Priority
    const status = formData.get('status') as Status
    const projectId = Number(formData.get('projectId'))
    const dueDateStr = formData.get('dueDate') as string | null
    const dueDate = dueDateStr ? new Date(dueDateStr) : null
    const assigneeIds = formData.getAll('assigneeIds').map(Number).filter(Boolean)

    await prisma.task.create({
        data: {
            title,
            description,
            priority,
            status,
            projectId,
            dueDate,
            assignees: {
                create: assigneeIds.map(userId => ({ userId })),
            },
        }
    })
    revalidatePath('/')
    revalidatePath('/projects')
}

export async function createProject(formData: FormData){
    const slug = formData.get('slug') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const memberIds = formData.getAll('memberIds').map(Number).filter(Boolean)

    await prisma.project.create({
        data: {
            slug,
            title,
            description,
            members: {
                create: memberIds.map(userId => ({ userId, role: 'member' })),
            },
        }
    })
    revalidatePath('/projects')
    redirect('/projects')
}
