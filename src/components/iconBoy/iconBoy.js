import Jira from '../../assets/logos/jira.svg';
import DefIcon from '../../assets/logos/default.png';
import FigmaIcon from '../../assets/logos/figma.svg';
import FileIcon from '../../assets/logos/file.png';
import GithubIcon from '../../assets/logos/github.png';
import GitlabIcon from '../../assets/logos/gitlab.svg';
import GoogleGmailIcon from '../../assets/logos/gmail.svg';
import GoogleDocsIcon from '../../assets/logos/google_docs.svg';
import GoogleDriveIcon from '../../assets/logos/google_drive.svg';
import GoogleIcon from '../../assets/logos/google.svg';

import { BsSearch } from 'react-icons/bs';
import { CgHome, CgGoogle, CgMail, CgAdidas } from 'react-icons/cg';
import { IoPeople } from 'react-icons/io5';
import { MdSettings, MdPageview, MdError } from 'react-icons/md';
import { FiFigma } from 'react-icons/fi';
import { FcCalendar, FcGoogle } from 'react-icons/fc';
import {
	SiZoom,
	SiGmail,
	SiNotion,
	SiMicrosoftoutlook,
	SiMicrosoftteams,
	SiGooglehangoutsmeet,
} from 'react-icons/si';
import { ImGithub } from 'react-icons/im';
import { FaJira } from 'react-icons/fa';
import { DiGoogleDrive } from 'react-icons/di';

import { AiOutlineHistory } from 'react-icons/ai';

export default function Icon({ serviceName }) {
	const things = {
		// default: DefIcon,
		msftMail: SiMicrosoftoutlook,
		meet: SiGooglehangoutsmeet,
		history: AiOutlineHistory,
		figma: FiFigma,
		notion: SiNotion,
		googleWorkspace: FcGoogle,
		googleEmail: CgMail,
		googleDrive: DiGoogleDrive,
		SiMicrosoftteams: SiMicrosoftteams,
		googleCalendar: FcCalendar,
		// google_drive_api: GoogleDocsIcon,
		// file: FileIcon,
		github: ImGithub,
		// jira: Jira,
		jira: FaJira,
		// gitlab: GitlabIcon,
		// gmail: GoogleGmailIcon,
		// google_docs: GoogleDocsIcon,
		// google_drive: GoogleDriveIcon,
		// google: GoogleIcon,
		zoom: SiZoom,
		default: MdPageview,
		// Searching/Filtering options
		all: CgHome,
		optionGoogle: CgGoogle,
		optionGmail: CgMail,
		gmail: SiGmail,
		optionZoom: SiZoom,
		optionPeople: IoPeople,
		optionSettings: MdSettings,
		error: MdError,
	};
	const ImageSource =
		serviceName in things ? things[serviceName] : things.default;
	return <ImageSource />;
}
