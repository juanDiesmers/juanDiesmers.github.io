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
        subtitulo: 'Costo de conquista con Dijkstra',
        subtitulo_en: 'Conquest cost with Dijkstra',
        code: `int calcularCostoConquista(const Territorio& inicio, const Territorio& destino,
                           const Grafo& grafoEnemigos, int idJugadorActual) {
    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>,
                        std::greater<std::pair<int, int>>> pq;
    std::unordered_map<int, int> costos;
    pq.push({0, inicio.id});
    costos[inicio.id] = 0;

    while (!pq.empty()) {
        int costo_actual = pq.top().first;
        int nodo_actual = pq.top().second;
        pq.pop();
        if (nodo_actual == destino.id) return costos[destino.id];

        for (int vecino_id : grafoEnemigos.ObtenerConexionesEnemigas(nodo_actual, idJugadorActual)) {
            const auto& vecino = grafoEnemigos.ObtenerTerritorio(vecino_id);
            int nuevo_costo = costo_actual + vecino.unidades_ejercito;
            if (!costos.count(vecino.id) || nuevo_costo < costos[vecino.id]) {
                costos[vecino.id] = nuevo_costo;
                pq.push({nuevo_costo, vecino.id});
            }
        }
    }
    return INT_MAX;
}`,
        explicacion: 'El peso de pasar por un territorio enemigo es la cantidad de ejércitos que tiene. Dijkstra encuentra la ruta que obliga a derrotar menos ejércitos para llegar al objetivo.',
        explicacion_en: 'The weight of going through an enemy territory is the number of armies on it. Dijkstra finds the route that requires defeating the fewest armies to reach the target.'
      },
      {
        subtitulo: 'Árbol de Huffman para comprimir la partida',
        subtitulo_en: 'Huffman tree to compress the saved game',
        code: `Node* Huffman::buildHuffmanTree(const std::string& text) {
    std::unordered_map<char, int> freq;
    for (char ch : text) freq[ch]++;

    std::priority_queue<Node*, std::vector<Node*>, comp> pq;
    for (auto pair : freq)
        pq.push(getNode(pair.first, pair.second, nullptr, nullptr));

    while (pq.size() != 1) {
        Node* left = pq.top(); pq.pop();
        Node* right = pq.top(); pq.pop();
        pq.push(getNode('\\0', left->freq + right->freq, left, right));
    }
    return pq.top();
}`,
        explicacion: 'Los caracteres que más se repiten en el archivo de la partida quedan cerca de la raíz y reciben códigos de pocos bits; los raros quedan abajo, con códigos largos.',
        explicacion_en: 'The most frequent characters in the saved game end up near the root and get short bit codes; rare ones end up deeper, with long codes.'
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
    resumen: 'Wiki del grupo para la materia de Desarrollo Web, hecha con Spring Boot y Thymeleaf. Tiene páginas de presentación, descripción del proyecto y requerimientos, y una encuesta cuyo formulario se valida en el navegador y se guarda en MySQL con JPA. Se empaqueta con Docker y se despliega en Kubernetes.',
    resumen_en: 'Group wiki for the Web Development course, built with Spring Boot and Thymeleaf. It has presentation, project description and requirements pages, plus a survey whose form is validated in the browser and saved to MySQL with JPA. It is packaged with Docker and deployed on Kubernetes.',
    tecnologias: ['Java', 'Spring Boot', 'Thymeleaf', 'JPA', 'MySQL', 'Docker', 'Kubernetes'],
    github: 'https://github.com/juanDiesmers/WikiGroupT1',
    imagen: 'assets/images/project3.jpg',
    secciones: [
      {
        subtitulo: 'Controlador que recibe la encuesta',
        subtitulo_en: 'Controller that receives the survey',
        code: `@PostMapping("/submit")
public String handleSubmitForm(Application formData) {
    Application application = new Application();
    application.setName(formData.getName());
    application.setApellidos(formData.getApellidos());
    application.setCorreo(formData.getCorreo());
    application.setDescripcion(formData.getDescripcion());
    application.setSemestre(formData.getSemestre());
    application.setEdad(formData.getEdad());
    application.setFecha(formData.getFecha());

    // Guardar la nueva instancia en la base de datos
    this.applicationRepository.save(application);
    return "Resultado";
}`,
        explicacion: 'Spring convierte los campos del formulario en un objeto Application, el repositorio lo guarda en MySQL y Thymeleaf devuelve la página Resultado.',
        explicacion_en: 'Spring maps the form fields into an Application object, the repository saves it to MySQL and Thymeleaf returns the Resultado page.'
      },
      {
        subtitulo: 'Entidad con borrado lógico',
        subtitulo_en: 'Entity with soft delete',
        code: `@Entity
@Getter @Setter
@Where(clause = "status = 0")
@SQLDelete(sql = "UPDATE application SET status = 1 WHERE id=?")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String apellidos;
    private int edad;
    private String correo;
    private String descripcion;
    private int semestre;
    private LocalDate fecha;
}`,
        explicacion: 'Borrar un registro no lo elimina: @SQLDelete lo marca con status = 1 y @Where hace que las consultas solo vean los registros con status = 0.',
        explicacion_en: 'Deleting a record does not remove it: @SQLDelete marks it with status = 1 and @Where makes queries see only records with status = 0.'
      },
      {
        subtitulo: 'Validación del correo en el navegador',
        subtitulo_en: 'Email validation in the browser',
        code: `const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i;

edad.addEventListener('input', function() {
    if (edad.value === "" || isNaN(edad.value) || edad.value < 0 || edad.value >= 100) {
        edad.style.borderColor = "red";
        mensajeError.innerHTML = "Edad: Obligatorio. Debe ser un número entero entre 0 y 99.<br>";
    } else {
        edad.style.borderColor = "";
    }
});`,
        explicacion: 'Antes de enviar, cada campo se revisa mientras el usuario escribe, para no mandar al servidor datos que de todas formas no se podrían guardar.',
        explicacion_en: 'Before submitting, each field is checked as the user types, so data that could not be saved anyway never reaches the server.'
      }
    ]
  },
  'Portafolio Web': {
    title: 'Portafolio Web',
    title_en: 'Web Portfolio',
    resumen: 'Este mismo sitio. Está hecho a mano con HTML, CSS y JavaScript, sin frameworks: el encabezado corre el Juego de la Vida en un canvas, los textos cambian entre español e inglés y la demo de cada proyecto se descarga solo cuando alguien la abre.',
    resumen_en: 'This very site. Handmade with HTML, CSS and JavaScript, no frameworks: the header runs the Game of Life on a canvas, the text switches between Spanish and English, and each project demo is downloaded only when someone opens it.',
    tecnologias: ['HTML5', 'CSS3', 'JavaScript', 'Canvas', 'Web Audio'],
    github: 'https://github.com/juanDiesmers/juanDiesmers.github.io',
    imagen: 'assets/images/project4.jpg',
    secciones: [
      {
        subtitulo: 'Una generación del Juego de la Vida',
        subtitulo_en: 'One Game of Life generation',
        code: `for (let y = 0; y < rows; y++) {
  const yu = ((y - 1 + rows) % rows) * cols, yc = y * cols, yd = ((y + 1) % rows) * cols;
  for (let x = 0; x < cols; x++) {
    const xl = (x - 1 + cols) % cols, xr = (x + 1) % cols;
    const n = grid[yu + xl] + grid[yu + x] + grid[yu + xr] +
              grid[yc + xl] +                grid[yc + xr] +
              grid[yd + xl] + grid[yd + x] + grid[yd + xr];
    const alive = grid[yc + x];
    next[yc + x] = alive ? (n === 2 || n === 3) : n === 3;
  }
}
[grid, next] = [next, grid];`,
        explicacion: 'La cuadrícula es un Uint8Array plano y los bordes se conectan con módulo, así el patrón que sale por un lado entra por el otro. Se usan dos arreglos y se intercambian para no crear memoria nueva en cada cuadro.',
        explicacion_en: 'The grid is a flat Uint8Array and the edges wrap with modulo, so a pattern leaving one side comes back on the other. Two arrays are swapped so no new memory is allocated each frame.'
      },
      {
        subtitulo: 'Cargar cada demo solo cuando se necesita',
        subtitulo_en: 'Loading each demo only when needed',
        code: `function loadDemo(name) {
  if (window.PortfolioDemos[name]) return Promise.resolve(window.PortfolioDemos[name]);
  if (!demoPromises[name]) {
    demoPromises[name] = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = \`assets/js/demos/\${name}.js?v=\${ASSET_VERSION}\`;
      s.onload = () => resolve(window.PortfolioDemos[name]);
      s.onerror = () => { delete demoPromises[name]; reject(new Error('No se pudo cargar la demo')); };
      document.head.appendChild(s);
    });
  }
  return demoPromises[name];
}`,
        explicacion: 'La página inicial no descarga las demos ni el diccionario del Scrabble. Cuando alguien abre un proyecto se agrega el script; si falla, se borra la promesa para poder intentarlo otra vez.',
        explicacion_en: 'The initial page does not download the demos or the Scrabble dictionary. When someone opens a project the script is added; if it fails, the promise is cleared so it can be retried.'
      },
      {
        subtitulo: 'Cambiar de idioma sin recargar',
        subtitulo_en: 'Switching language without reloading',
        code: `function apply(next) {
  lang = next;
  const dict = lang === 'en' ? window.I18N_EN : es;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (!(k in es)) es[k] = el.innerHTML;   // el español sale del propio HTML
    if (dict[k] != null) el.innerHTML = dict[k];
  });
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}`,
        explicacion: 'El español vive en el HTML y solo el inglés está en un diccionario. Al cambiar de idioma se dispara un evento para que las partes generadas con JavaScript, como los proyectos, se vuelvan a dibujar.',
        explicacion_en: 'Spanish lives in the HTML and only English is in a dictionary. Switching language fires an event so the parts generated with JavaScript, like the projects, redraw themselves.'
      }
    ]
  },
  'SimpleEqProyectoAvanzada': {
    title: 'SimpleEqProyectoAvanzada',
    title_en: 'SimpleEQ audio plugin',
    resumen: 'Plugin de ecualizador hecho en C++ con JUCE. Cada canal pasa por una cadena de tres etapas: un filtro pasa altos (low cut), un filtro de pico con frecuencia, ganancia y Q, y un filtro pasa bajos (high cut). Los cortes tienen pendientes de 12 a 48 dB por octava, armadas con filtros Butterworth en cascada.',
    resumen_en: 'Equalizer plugin built in C++ with JUCE. Each channel runs through a three-stage chain: a high-pass filter (low cut), a peak filter with frequency, gain and Q, and a low-pass filter (high cut). The cuts have 12 to 48 dB per octave slopes, built from cascaded Butterworth filters.',
    tecnologias: ['C++', 'JUCE', 'DSP', 'Filtros IIR'],
    github: 'https://github.com/juanDiesmers/SimpleEqProyectoAvanzada',
    imagen: 'assets/images/project5.jpg',
    secciones: [
      {
        subtitulo: 'La cadena de filtros',
        subtitulo_en: 'The filter chain',
        code: `using Filter = juce::dsp::IIR::Filter<float>;

// Un corte = hasta 4 filtros de 2º orden en serie (12, 24, 36 o 48 dB/oct)
using CutFilter = juce::dsp::ProcessorChain<Filter, Filter, Filter, Filter>;

// Cada canal: LowCut -> Peak -> HighCut
using MonoChain = juce::dsp::ProcessorChain<CutFilter, Filter, CutFilter>;

enum ChainPositions { LowCut, Peak, HighCut };`,
        explicacion: 'El canal izquierdo y el derecho tienen cada uno su MonoChain. Cambiar la pendiente no crea filtros nuevos: solo activa más o menos etapas del CutFilter.',
        explicacion_en: 'The left and right channels each have their own MonoChain. Changing the slope does not create new filters: it just enables more or fewer stages of the CutFilter.'
      },
      {
        subtitulo: 'Activar etapas según la pendiente',
        subtitulo_en: 'Enabling stages by slope',
        code: `template<typename ChainType, typename CoefficientType>
void updateCutFilter(ChainType& chain, const CoefficientType& coefficients, const Slope& slope)
{
    chain.template setBypassed<0>(true);
    chain.template setBypassed<1>(true);
    chain.template setBypassed<2>(true);
    chain.template setBypassed<3>(true);

    switch (slope)   // sin break: cada caso cae al siguiente
    {
    case Slope_48: update<3>(chain, coefficients);
    case Slope_36: update<2>(chain, coefficients);
    case Slope_24: update<1>(chain, coefficients);
    case Slope_12: update<0>(chain, coefficients);
    }
}`,
        explicacion: 'El switch sin break es intencional: con 48 dB/oct entra en el primer caso y sigue de largo activando las cuatro etapas; con 12 dB/oct solo activa la primera.',
        explicacion_en: 'The switch without break is intentional: at 48 dB/oct it enters the first case and falls through, enabling all four stages; at 12 dB/oct it only enables the first one.'
      },
      {
        subtitulo: 'Coeficientes del pico y de los cortes',
        subtitulo_en: 'Peak and cut coefficients',
        code: `Coefficients makePeakFilter(const ChainSettings& s, double sampleRate)
{
    return juce::dsp::IIR::Coefficients<float>::makePeakFilter(sampleRate,
        s.peakFreq, s.peakQuality,
        juce::Decibels::decibelsToGain(s.peakGainInDecibels));
}

inline auto makeLowCutFilter(const ChainSettings& s, double sampleRate)
{
    return juce::dsp::FilterDesign<float>::designIIRHighpassHighOrderButterworthMethod(
        s.lowCutFreq, sampleRate, 2 * (s.lowCutSlope + 1));
}`,
        explicacion: 'El orden del Butterworth es 2 × (pendiente + 1): orden 2 para 12 dB/oct y orden 8 para 48 dB/oct. JUCE devuelve un arreglo con los coeficientes de cada etapa.',
        explicacion_en: 'The Butterworth order is 2 × (slope + 1): order 2 for 12 dB/oct and order 8 for 48 dB/oct. JUCE returns an array with the coefficients of each stage.'
      },
      {
        subtitulo: 'Procesar cada bloque de audio',
        subtitulo_en: 'Processing each audio block',
        code: `void SimpleEQAudioProcessor::processBlock(juce::AudioBuffer<float>& buffer, juce::MidiBuffer&)
{
    updateFilters();

    juce::dsp::AudioBlock<float> block(buffer);
    auto leftBlock  = block.getSingleChannelBlock(0);
    auto rightBlock = block.getSingleChannelBlock(1);

    juce::dsp::ProcessContextReplacing<float> leftContext(leftBlock);
    juce::dsp::ProcessContextReplacing<float> rightContext(rightBlock);

    leftChain.process(leftContext);
    rightChain.process(rightContext);
}`,
        explicacion: 'El host de audio llama a processBlock cientos de veces por segundo. En cada llamada se actualizan los coeficientes con los valores de las perillas y se filtra cada canal.',
        explicacion_en: 'The audio host calls processBlock hundreds of times per second. Each call updates the coefficients from the knob values and filters each channel.'
      }
    ]
  }
};
