import type {PayloadRequest} from 'payload'
import type {Chat} from "../../payload-types";

export const queryChats = async (req: PayloadRequest):Promise<Chat[]> => {
	const records = await req.payload.find({
		overrideAccess: false,
		user: req.user,
		collection: 'chats',
		where: { "user.email": { equals: req.user?.email } },
		sort: '-sent',
	})

	return records.docs
}
