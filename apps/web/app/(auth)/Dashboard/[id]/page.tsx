import Dashboard from "../../../components/dashboard/dashboard";

type props ={
    params: Promise<{id: string}>
}

export default async function Page({params}: props) {
    const {id} = await params;
    return (
        <Dashboard />
    )
}