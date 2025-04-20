import {createClient} from "@supabase/supabase-js";

export const supabase = createClient(
    "https://wyvbrlrnrtftvjggnkbk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5dmJybHJucnRmdHZqZ2dua2JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwODMyMzQsImV4cCI6MjA2MDY1OTIzNH0.4cI32nHBthEblOVFeYdAMSWv_49YOLV5jNBhryj-dsg"
)