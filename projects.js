
/*
  ========================================
  PROJECT DATABASE
  ========================================

  HOW TO EDIT:
  - title       = Project name
  - year        = Project year
  - category    = Project category
  - image       = Photo path
  - short       = Short text on project card
  - description = Full description in popup
  - tags        = Technologies and skills

  Add new projects by copying one object.
*/

const projects = [
  {
    id: 1,
    title: "Fundamental Electronic Circuits",
    year: "2024",
    category: "ELECTRONICS",
    image: "assets/images/project-1.jpg",

    short: "Digital logic, power supply, and fundamental circuit design.",

    description:
      "Designed and implemented fundamental electronic circuits as part of a first-semester Project-Based Learning program. The project included a 2-bit adder, DC power supply, voltage and current divider circuits, a 0–9 digital counter, and RC circuits.",

    tags: [
      "Digital Electronics",
      "Power Supply",
      "Circuit Design",
      "RC Circuit"
    ]
  },

  {
    id: 2,
    title: "Analog Electronics & Motor Control",
    year: "2025",
    category: "ELECTRONICS",

    image: "assets/images/project-2.jpg",

    short: "Analog circuit implementation and MATLAB instrumentation.",

    description:
      "Developed and tested analog electronic circuits, including a ±12V symmetric power supply, operational amplifier circuits, transistor circuits, and DC motor control. The project also explored virtual instrumentation using MATLAB.",

    tags: [
      "Op-Amp",
      "DC Motor",
      "MATLAB",
      "Transistors",
      "Power Supply"
    ]
  },

  {
    id: 3,
    title: "Mini Vertical Conveyor",
    year: "2025",
    category: "CONTROL SYSTEM",

    image: "assets/images/project-3.jpg",

    short: "Closed-loop DC motor speed control using PID.",

    description:
      "Designed and developed a mini vertical conveyor system with PID-based DC motor speed control. The system integrated an ATmega-based microcontroller, motor driver, and encoder feedback to monitor and regulate motor speed. System performance was evaluated through response and stability testing.",

    tags: [
      "PID Control",
      "ATmega",
      "DC Motor",
      "Encoder",
      "Embedded Systems"
    ]
  },

  {
    id: 4,
    title: "IoT Automated Maggot Bioreactor",
    year: "2026",
    category: "IOT & AUTOMATION",

    image: "assets/images/project-4.jpg",

    short: "Automated environmental regulation for BSF larvae cultivation.",

    description:
      "Developed an IoT-based automated maggot bioreactor using ESP32, SHT41 sensors, and PID control. The system monitored temperature and humidity, controlled heating, ventilation, and misting actuators, and communicated with a monitoring application through MQTT over Wi-Fi.",

    tags: [
      "ESP32",
      "IoT",
      "MQTT",
      "PID",
      "SHT41",
      "Automation"
    ]
  },

  {
    id: 5,
    title: "Industrial Robotic Arm",
    year: "2026",
    category: "ROBOTICS",

    image: "assets/images/project-5.jpg",

    short: "Robotic manipulation, kinematics, and digital twin development.",

    description:
      "A robotic arm development project focused on pick-and-place operations, forward and inverse kinematics, and digital twin integration. The project explores synchronizing a physical robotic arm with a virtual model for simulation and motion analysis.",

    tags: [
      "Robotics",
      "Forward Kinematics",
      "Inverse Kinematics",
      "Digital Twin",
      "CoppeliaSim"
    ]
  }
];
