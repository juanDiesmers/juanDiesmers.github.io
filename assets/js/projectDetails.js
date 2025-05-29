// Archivo con la información extendida de cada proyecto para el modal
// Puedes editar aquí la descripción, fragmentos de código y explicación detallada de cada proyecto

window.projectDetailsData = {
  'ProyectoEstructuraDatos_R.I.S.K': {
    title: 'ProyectoEstructuraDatos_R.I.S.K',
    title_en: 'RISK Data Structures Project',
    resumen: 'Juego de estrategia tipo RISK implementado en C++ como proyecto universitario avanzado. Permite a varios jugadores competir por el control de territorios, con lógica de turnos, ataques, refuerzos y guardado de partidas.',
    resumen_en: 'Strategy game inspired by RISK, implemented in C++ as an advanced university project. Allows multiple players to compete for territory control, with turn logic, attacks, reinforcements, and save/load features.',
    tecnologias: ['C++', 'Algoritmos', 'Estructuras de datos'],
    github: 'https://github.com/juanDiesmers/ProyectoEstructuraDatos_R.I.S.K',
    imagen: 'assets/images/project1.jpg',
    secciones: [
      {
        subtitulo: 'Inicialización y asignación de territorios',
        subtitulo_en: 'Initialization and Territory Assignment',
        code: `bool inicializarJuego(std::vector<Jugador>& jugadores, std::vector<Territorio>& territorios) {
    limpiarPantalla();
    cout << "Bienvenido a la inicializacion del juego Risk!" << endl;
    int num_jugadores;
    while (num_jugadores < 2 || num_jugadores > 6) {
        cout << "Ingrese el numero de jugadores (2-6): ";
        cin >> num_jugadores;
        if (num_jugadores < 2 || num_jugadores > 6) {
            cout << "Numero de jugadores no valido." << endl;
        }
    }
    jugadores.resize(num_jugadores);
    for (int i = 0; i < num_jugadores; i++) {
        cout << "Jugador " << i + 1 << ": Ingrese su nombre: ";
        cin >> jugadores[i].nombre;
        // ...validación de color...
    }
    // Asignación de territorios
    cout << "El juego se ha inicializado correctamente." << endl;
    return true;
}`,
        explicacion: 'Esta función guía la configuración inicial del juego: pide los nombres y colores de los jugadores, valida que no se repitan y asigna los territorios de forma interactiva.',
        explicacion_en: 'This function guides the initial game setup: asks for player names and colors, validates uniqueness, and assigns territories interactively.'
      },
      {
        subtitulo: 'Validación de turno de jugador',
        subtitulo_en: 'Player Turn Validation',
        code: `bool validacionJugador(vector<Jugador>& jugadores, int id_jugador_actual) {
    bool validado = false;
    for (int i = 0; i < jugadores.size(); i++){
        if(jugadores[i].id == id_jugador_actual){
            validado = true;
            break;
        }
    }
    if(!validado){
        cout << "El jugador con ID " << id_jugador_actual << " no forma parte del juego" << endl;
    }
    return validado;
}`,
        explicacion: 'Valida que el jugador que intenta jugar realmente tiene el turno y pertenece a la partida.',
        explicacion_en: 'Validates that the player attempting to play actually has the turn and is part of the game.'
      },
      {
        subtitulo: 'Ataques y lógica de combate',
        subtitulo_en: 'Attacks and Combat Logic',
        code: `void realizarAtaques(std::vector<Jugador>& jugadores, std::vector<Territorio>& territorios, int id_jugador_actual) {
    // ... Selección de territorio y dados ...
    int dados_ataque = 3;
    int dados_defensa = 2;
    cout << "Lanzando dados: " << endl;
    // ...lógica de ataque y defensa...
    cout << "Resultado de los dados de ataque: ";
    for (int i = 0; i < dados_ataque; i++) {
        cout << resultado_ataque[i] << " ";
    }
    cout << endl;
    cout << "Resultado de los dados de defensa: ";
    for (int i = 0; i < dados_defensa; i++) {
        cout << resultados_defensa[i] << " ";
    }
    cout << endl;
    // Comparaciones y actualización de unidades
}`,
        explicacion: 'Permite a un jugador atacar territorios vecinos, lanzando dados y comparando resultados para determinar el resultado del combate, simulando la mecánica clásica de RISK.',
        explicacion_en: 'Allows a player to attack neighboring territories, rolling dice and comparing results to determine the outcome, simulating classic RISK mechanics.'
      },
      {
        subtitulo: 'Construcción y visualización del grafo de enemigos',
        subtitulo_en: 'Enemy Graph Construction and Visualization',
        code: `void Grafo::MostrarInformacionGrafo() const {
    std::cout << "Información almacenada en el grafo:" << std::endl;
    for (const Territorio& territorio : territorios) {
        std::cout << "Territorio " << territorio.nombre << " (ID " << territorio.id << ")" << std::endl;
        std::cout << " - Jugador: " << territorio.jugador << std::endl;
        std::cout << " - Unidades de ejército: " << territorio.unidades_ejercito << std::endl;
        std::cout << " - Conexiones enemigas:" << std::endl;
        std::vector<int> conexionesEnemigas = ObtenerConexionesEnemigas(territorio.id, std::stoi(territorio.jugador));
        for (int enemigo : conexionesEnemigas) {
            std::cout << "   - Conexión enemiga con Territorio (ID " << enemigo << ")" << std::endl;
        }
        std::cout << std::endl;
    }
}`,
        explicacion: 'Permite visualizar la estructura de conexiones enemigas entre territorios, útil para la estrategia y depuración.',
        explicacion_en: 'Allows visualization of the enemy connections structure between territories, useful for strategy and debugging.'
      },
      {
        subtitulo: 'Guardado y carga de partidas',
        subtitulo_en: 'Saving and Loading Games',
        code: `bool guardarPartida(std::string nombre_archivo, std::vector<Jugador>& jugadores, std::vector<Territorio>& territorios) {
    // Serializa el estado actual del juego en un archivo de texto
    // ...
}
bool inicializarPartida(std::string nombre_archivo, std::vector<Jugador>& jugadores, std::vector<Territorio>& territorios) {
    // Lee y reconstruye el estado del juego desde archivo
    // ...
}`,
        explicacion: 'Permite guardar y restaurar el estado del juego, serializando la información de jugadores y territorios.',
        explicacion_en: 'Allows saving and restoring the game state, serializing player and territory information.'
      }
    ]
  },
  'Proyecto_Scrabble': {
    title: 'Proyecto_Scrabble',
    title_en: 'Scrabble Project',
    resumen: 'Versión digital del clásico juego Scrabble, desarrollada en C++ con estructuras de datos avanzadas. Permite validar palabras, calcular puntajes y sugerir jugadas.',
    resumen_en: 'Digital version of the classic Scrabble game, developed in C++ with advanced data structures. Allows word validation, score calculation, and move suggestions.',
    tecnologias: ['C++', 'Trie', 'Algoritmos de búsqueda'],
    github: 'https://github.com/juanDiesmers/Proyecto_Scrabble',
    imagen: 'assets/images/project2.jpg',
    secciones: [
      {
        subtitulo: 'Estructura Trie para palabras',
        subtitulo_en: 'Trie Structure for Words',
        code: `class TrieNode {
public:
    bool isEndOfWord;
    TrieNode* children[26];
    TrieNode();
    ~TrieNode();
};
class Trie {
protected:
    TrieNode* root;
    bool initialized;
    void clear(TrieNode* node);
    void collectAllWords(TrieNode* node, const std::string& currentWord, std::vector<std::string>& results) const;
public:
    Trie();
    virtual ~Trie();
    virtual void insert(const std::string& word);
    bool search(const std::string& word) const;
    bool wordsWithPrefix(const std::string& prefix, std::vector<std::string>& results) const;
};`,
        explicacion: 'El Trie permite almacenar y buscar palabras de forma eficiente, fundamental para validar jugadas y sugerir palabras en Scrabble.',
        explicacion_en: 'The Trie allows efficient storage and search of words, fundamental for validating moves and suggesting words in Scrabble.'
      },
      {
        subtitulo: 'Búsqueda de palabras por prefijo',
        subtitulo_en: 'Prefix Word Search',
        code: `bool Trie::wordsWithPrefix(const std::string& prefix, std::vector<std::string>& results) const {
    TrieNode* currentNode = root;
    for (char ch : prefix) {
        int index = std::tolower(ch) - 'a';
        if (currentNode->children[index] == nullptr) {
            return false;
        }
        currentNode = currentNode->children[index];
    }
    collectAllWords(currentNode, prefix, results);
    return !results.empty();
}`,
        explicacion: 'Permite encontrar todas las palabras que comienzan con un prefijo dado, útil para sugerencias y validaciones.',
        explicacion_en: 'Allows finding all words that start with a given prefix, useful for suggestions and validations.'
      },
      {
        subtitulo: 'Inicialización del diccionario desde archivo',
        subtitulo_en: 'Dictionary Initialization from File',
        code: `void Trie::initializeFromDictionaryFile(const std::string& filePath) {
    if (initialized) {
        std::cout << "(Árbol ya inicializado) El árbol del diccionario ya ha sido inicializado." << std::endl;
        return;
    }
    std::ifstream file(filePath);
    if (!file.is_open()) {
        std::cout << "(Archivo no existe) El archivo " << filePath << " no existe o no puede ser leído." << std::endl;
        return;
    }
    std::string word;
    while (file >> word) {
        if (std::all_of(word.begin(), word.end(), [](unsigned char c) { return std::isalpha(c); })) {
            std::transform(word.begin(), word.end(), word.begin(), [](unsigned char c) { return std::tolower(c); });
            insert(word);
        }
    }
    initialized = true;
    std::cout << "(Resultado exitoso) El árbol del diccionario se ha inicializado correctamente." << std::endl;
}`,
        explicacion: 'Carga todas las palabras válidas desde un archivo de texto y las inserta en el Trie para búsquedas rápidas.',
        explicacion_en: 'Loads all valid words from a text file and inserts them into the Trie for fast searches.'
      },
      {
        subtitulo: 'Cálculo de puntaje de una palabra',
        subtitulo_en: 'Word Score Calculation',
        code: `int calcularPuntajePalabra(const std::string& palabra) {
    std::vector<std::pair<char, int>> puntajes = {
        {'E', 1}, {'A', 1}, {'I', 1}, {'O', 1}, {'N', 1}, {'R', 1}, {'T', 1}, {'L', 1}, {'S', 1}, {'U', 1},
        {'D', 2}, {'G', 2}, {'B', 3}, {'C', 3}, {'M', 3}, {'P', 3},
        {'F', 4}, {'H', 4}, {'V', 4}, {'W', 4}, {'Y', 4},
        {'K', 5}, {'J', 8}, {'X', 8}, {'Q', 10}, {'Z', 10}
    };
    int puntaje = 0;
    for (char c : palabra) {
        char letra = std::toupper(c);
        auto it = std::find_if(puntajes.begin(), puntajes.end(), [&](const std::pair<char, int>& p) {
            return p.first == letra;
        });
        if (it != puntajes.end()) {
            puntaje += it->second;
        } else {
            return -1;
        }
    }
    return puntaje;
}`,
        explicacion: 'Calcula el puntaje de una palabra según las reglas clásicas de Scrabble, sumando el valor de cada letra.',
        explicacion_en: 'Calculates the score of a word according to classic Scrabble rules, summing the value of each letter.'
      },
      {
        subtitulo: 'Grafo de palabras y búsqueda de posibles jugadas',
        subtitulo_en: 'Word Graph and Possible Moves Search',
        code: `std::vector<std::string> GrafoPalabra::posiblesPalabras(const std::string& letrasDisponibles) {
    if (!grafoConstruido) {
        std::cout << "Error: El grafo debe ser construido antes de buscar palabras posibles." << std::endl;
        return {};
    }
    std::vector<std::string> resultado;
    std::vector<int> letrasContadas(26, 0);
    int wildcards = 0;
    for (char c : letrasDisponibles) {
        if (c == '?') wildcards++;
        else if (isalpha(c)) letrasContadas[tolower(c) - 'a']++;
    }
    for (const auto& palabra : palabrasValidas) {
        std::vector<int> letrasNecesarias = letrasContadas;
        bool esPosible = true;
        int comodinesUsados = 0;
        for (char letra : palabra) {
            int& cuenta = letrasNecesarias[tolower(letra) - 'a'];
            if (cuenta > 0) cuenta--;
            else if (wildcards > comodinesUsados) comodinesUsados++;
            else { esPosible = false; break; }
        }
        if (esPosible) resultado.push_back(palabra);
    }
    if (resultado.empty()) {
        std::cout << "No se encontraron palabras que se puedan formar con las letras dadas." << std::endl;
    } else {
        std::cout << "Palabras encontradas:" << std::endl;
        for (const auto& palabra : resultado) {
            std::cout << palabra << std::endl;
        }
    }
    return resultado;
}`,
        explicacion: 'Permite encontrar todas las palabras válidas que se pueden formar con un conjunto de letras, considerando comodines.',
        explicacion_en: 'Allows finding all valid words that can be formed with a set of letters, considering wildcards.'
      }
    ]
  },
  'WikiGroupT1': {
    title: 'WikiGroupT1',
    title_en: 'WikiGroupT1',
    resumen: 'Wiki colaborativa desarrollada en HTML, CSS y JavaScript para gestión de información grupal. Permite a los usuarios crear, editar y visualizar páginas de forma colaborativa.',
    resumen_en: 'Collaborative wiki developed in HTML, CSS, and JavaScript for group information management. Allows users to create, edit, and view pages collaboratively.',
    tecnologias: ['HTML5', 'CSS3', 'JavaScript'],
    github: '',
    imagen: 'assets/images/project3.jpg',
    secciones: [
      {
        subtitulo: 'Agregar página a la wiki',
        subtitulo_en: 'Add Page to Wiki',
        code: `function addWikiPage(title, content) {\n  const page = { title, content, created: new Date() };\n  wikiPages.push(page);\n  renderWiki();\n}`,
        explicacion: 'Permite a los usuarios agregar nuevas páginas, almacenando el título y contenido, y actualizando la vista para todos los miembros.',
        explicacion_en: 'Allows users to add new pages, storing the title and content, and updating the view for all members.'
      }
    ]
  },
  'Portafolio Web': {
    title: 'Portafolio Web',
    title_en: 'Web Portfolio',
    resumen: 'Portafolio personal moderno, responsivo y multilenguaje, hecho con HTML, CSS y JavaScript. Muestra proyectos, habilidades y hoja de vida de forma visual y profesional.',
    resumen_en: 'Modern, responsive, and multilingual personal portfolio built with HTML, CSS, and JavaScript. Showcases projects, skills, and resume in a visual and professional way.',
    tecnologias: ['HTML5', 'CSS3', 'JavaScript'],
    github: 'https://github.com/juanDiesmers/juanDiesmers.github.io',
    imagen: 'assets/images/project4.jpg',
    secciones: [
      {
        subtitulo: 'Renderizado dinámico de proyectos',
        subtitulo_en: 'Dynamic Project Rendering',
        code: `projects.forEach((project, i) => {\n  const card = document.createElement('div');\n  card.className = 'project-card fade-in';\n  card.innerHTML = '...';\n  container.appendChild(card);\n});`,
        explicacion: 'El portafolio utiliza JavaScript para renderizar dinámicamente los proyectos en un grid visual, permitiendo fácil mantenimiento y una experiencia visual atractiva.',
        explicacion_en: 'The portfolio uses JavaScript to dynamically render projects in a visual grid, allowing easy maintenance and an attractive visual experience.'
      }
    ]
  },
  'SimpleEqProyectoAvanzada': {
    title: 'SimpleEqProyectoAvanzada',
    title_en: 'SimpleEq Advanced Audio Project',
    resumen: 'Proyecto universitario de procesamiento de audio con C++ y el framework JUCE. Permite aplicar efectos y filtros en tiempo real.',
    resumen_en: 'University audio processing project using C++ and the JUCE framework. Allows applying effects and filters in real time.',
    tecnologias: ['C++', 'JUCE', 'Audio'],
    github: '',
    imagen: 'assets/images/project5.jpg',
    secciones: [
      {
        subtitulo: 'Procesamiento de audio en bloques',
        subtitulo_en: 'Block Audio Processing',
        code: `void processBlock(AudioBuffer<float>& buffer, MidiBuffer& midiMessages) {\n    for (int channel = 0; channel < buffer.getNumChannels(); ++channel) {\n        float* channelData = buffer.getWritePointer(channel);\n        for (int sample = 0; sample < buffer.getNumSamples(); ++sample) {\n            channelData[sample] = processSample(channelData[sample]);\n        }\n    }\n}`,
        explicacion: 'Procesa el audio en tiempo real, aplicando efectos a cada muestra usando el framework JUCE.',
        explicacion_en: 'Processes audio in real time, applying effects to each sample using the JUCE framework.'
      }
    ]
  }
};
