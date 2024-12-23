import { api } from "@/trpc/react"
import { useLocalStorage } from "usehooks-ts"

export const useProject = () => {
    const { data: projects } = api.project.getProjects.useQuery()

    /* 当前选择的projectId */
    const [projectId, setProjectId] = useLocalStorage("projectId", " ")
    const project = projects?.find(project => project.id === projectId)


    return {
        projects,
        project,
        projectId,
        setProjectId
    }
}