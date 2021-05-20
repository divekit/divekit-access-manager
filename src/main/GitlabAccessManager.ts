import dotenv from "dotenv";
import { Gitlab, ProjectSchema } from "gitlab";
import { AccessLevel } from "gitlab/dist/types/core/templates";

dotenv.config();
const gitlab = new Gitlab({
    host: process.env.HOST,
    token: process.env.API_TOKEN,
});


export class GitlabAccessManager {

    public async addSupervisorsToGroups(groupIds: number[], supervisors: string[]) {
        for (let groupId of groupIds) {
            await this.addSupervisorsToGroup(groupId, supervisors);
        }
    }

    public async addSupervisorsToGroup(groupId: number, supervisors: string[]) {
        console.log(`Starting to add supervisors to group ${groupId}`);
        let projects = await gitlab.GroupProjects.all(groupId);
        for (let project of projects) {
            await this.addSupervisorsToProject(project.id, supervisors);
        }
    }

    private async addSupervisorsToProject(projectId: number, supervisors: string[]) {
        for (let supervisor of supervisors) {
            let users: any = await gitlab.Users.search(supervisor);
            if (users.length == 0) {
                console.log(`Warning: Could not find user ${supervisor} by name`);
            } else {
                let user = users[0];
                try {
                    await gitlab.ProjectMembers.add(projectId, user.id, 40);
                    console.log(`Added User ${supervisor} to project`);
                } catch (error) {
                    console.log(`Warning: Could not add user ${supervisor} to project ${projectId}`);
                    console.log(error);
                }
            }
        }
    }
}