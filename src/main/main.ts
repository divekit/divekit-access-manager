import { GitlabAccessManager } from "./GitlabAccessManager";

import * as accessConfig from '../config/accessConfig.json';


let gitlabAccessManager: GitlabAccessManager = new GitlabAccessManager();
gitlabAccessManager.addSupervisorsToGroups(accessConfig.groupIds, accessConfig.supervisors);
