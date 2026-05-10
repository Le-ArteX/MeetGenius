import NoteDetails from "../../../components/notes/NoteDetails";

type props = {
    params: Promise<{ id: string }>
}

export default async function Page({ params }: props) {
    const { id } = await params;
    return (
        <NoteDetails />
    )
}