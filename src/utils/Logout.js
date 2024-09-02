import { supabase } from "@/lib/supabase";


export const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
};