import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://chutexfnzoylpuikeblz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodXRleGZuem95bHB1aWtlYmx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzgwMzEsImV4cCI6MjA5MDM1NDAzMX0.ztlIq_qaDfe_nH_zGQl7vpN-GCoupEnUJ7xEaqi6XvU"

export const supabase = createClient(supabaseUrl, supabaseKey)