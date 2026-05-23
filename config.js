// c:\xampp\htdocs\mamb_prueba - copia\config.js

// URL y clave
const SUPABASE_URL = 'https://jddxrojuakytxbxmzysh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZHhyb2p1YWt5dHhieG16eXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDAwMDMsImV4cCI6MjA5NDM3NjAwM30.rJmnsZ6rhRH3tcJ79snAQxBztfbxe5NVP19psn3oOg4';

// Inicializar el cliente de Supabase
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
