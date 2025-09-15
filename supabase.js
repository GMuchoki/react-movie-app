import { createClient } from '@supabase/supabase-js'

// Environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        // 1. Check if the search term exists in the database
        const { data: existingRecords, error: selectError } = await supabase
            .from('metrics')  // table name
            .select('*')
            .eq('searchTerm', searchTerm)
            .limit(1)

        if (selectError) {
            throw selectError
        }

        // 2. If it exists, update the count
        if (existingRecords && existingRecords.length > 0) {
            const record = existingRecords[0]
            const { error: updateError } = await supabase
                .from('metrics')
                .update({ 
                    count: record.count + 1 
                })
                .eq('id', record.id)

            if (updateError) {
                throw updateError
            }
        } 
        // 3. If it doesn't exist, create a new record
        else {
            const { error: insertError } = await supabase
                .from('metrics')
                .insert([
                    {
                        searchTerm,
                        count: 1,
                        movie_id: movie.id,
                        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    }
                ])

            if (insertError) {
                throw insertError
            }
        }
    } catch (error) {
        console.error('Error updating search count:', error)
    }
}
