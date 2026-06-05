/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    'instalacion',
    'arquitectura',
    {
      type: 'category',
      label: 'Base de Datos',
      items: ['base-de-datos'],
    },
    {
      type: 'category',
      label: 'Funcionalidades',
      items: [
        'funcionalidades/camara',
        'funcionalidades/galeria',
        'funcionalidades/logros',
        'funcionalidades/perfil',
        'funcionalidades/artistas',
      ],
    },
    'supabase',
    'equipo',
  ],
};

module.exports = sidebars;
