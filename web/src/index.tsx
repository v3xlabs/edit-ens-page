export const GATEWAY_VIEW = "https://rs.myeth.id/view/";

type ProfileResponse = {
    name: string;
    records: Record<string, string>;
    addresses: Record<string, string>;
};

export const getProfile = async (name: string) => {
    const request = await fetch(GATEWAY_VIEW + name);

    const data: ProfileResponse = await request.json();

    return data;
}

const profile = await getProfile("luc.willbreak.eth");

console.log(profile);
