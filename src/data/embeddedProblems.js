export const embeddedProblems = [
  {
    id: 1,
    title: 'Count set bits in a register',
    difficulty: 'Easy',
    time: '15 min',
    type: 'Embedded C',
    functionName: 'count_set_bits',
    summary: 'Write a function to count how many bits are set in an 8-bit register, a common pattern in embedded status monitoring.',
    prompt: 'Given an 8-bit value, return the number of set bits (1s) in the binary representation. This pattern is frequently used when reading GPIO masks, status flags, or sensor bitfields.',
    constraints: ['0 <= value <= 255', 'Use bitwise operations instead of repeated string conversion'],
    examples: [
      { input: '5', output: '2', explanation: 'Binary 00000101 contains two 1s.' },
      { input: '255', output: '8', explanation: 'All eight bits are set.' },
      { input: '170', output: '4', explanation: 'Binary 10101010 has four bits set.' },
    ],
    starterCode: `#include <stdint.h>

uint8_t count_set_bits(uint8_t value) {
    uint8_t count = 0;
    for (uint8_t i = 0; i < 8; i++) {
        if ((value & (1u << i)) != 0) {
            count++;
        }
    }
    return count;
}`,
    testCases: [
      { input: [5], expected: 2 },
      { input: [255], expected: 8 },
      { input: [170], expected: 4 },
      { input: [0], expected: 0 },
    ],
    explanation: 'A common embedded strategy is to inspect each bit using a mask. Shifting a 1 bit by position i and ANDing it with the value lets the code determine whether that bit is set. This is efficient and works well with GPIO and register masks.',
    referenceAnswer: `uint8_t count_set_bits(uint8_t value) {
    uint8_t count = 0;
    while (value != 0) {
        value &= (value - 1);
        count++;
    }
    return count;
}`,
  },
  {
    id: 2,
    title: 'Reverse the bits of a word',
    difficulty: 'Easy',
    time: '18 min',
    type: 'Embedded C',
    functionName: 'reverse_bits',
    summary: 'Reverse the bit order of a 32-bit value, which is common in UART framing and bit manipulation tasks.',
    prompt: 'Write a function that reverses the order of bits in a 32-bit unsigned integer. Example: 0x00000001 should become 0x80000000.',
    constraints: ['Input is a 32-bit unsigned integer', 'Do not use bitwise reverse libraries or built-in helper functions'],
    examples: [
      { input: '1', output: '2147483648', explanation: 'Bit 0 moves to the highest bit position.' },
      { input: '3', output: '3221225472', explanation: '00000011 becomes 11000000...00.' },
      { input: '0x12345678', output: '0x1E6A2C48', explanation: 'The entire bit ordering is mirrored.' },
    ],
    starterCode: `#include <stdint.h>

uint32_t reverse_bits(uint32_t value) {
    uint32_t result = 0;
    for (uint8_t i = 0; i < 32; i++) {
        result = (result << 1) | (value & 1u);
        value >>= 1;
    }
    return result;
}`,
    testCases: [
      { input: [1], expected: 2147483648 },
      { input: [3], expected: 3221225472 },
      { input: [0x12345678], expected: 0x1E6A2C48 },
      { input: [0], expected: 0 },
    ],
    explanation: 'The algorithm builds the reversed value one bit at a time. Each iteration takes the least significant bit of the source and appends it as the new most significant bit of the result. This is a classic embedded pattern for register-order conversion.',
    referenceAnswer: `uint32_t reverse_bits(uint32_t value) {
    uint32_t result = 0;
    for (uint8_t i = 0; i < 32; i++) {
        result = (result << 1) | (value & 1u);
        value >>= 1;
    }
    return result;
}`,
  },
  {
    id: 3,
    title: 'Check parity of a byte',
    difficulty: 'Easy',
    time: '12 min',
    type: 'Embedded C',
    functionName: 'is_even_parity',
    summary: 'Detect whether a byte has an even number of set bits, often used for data validation and communication checks.',
    prompt: 'Return 1 if the number of set bits in the byte is even, otherwise return 0. This is useful in data integrity checks, framing validation, and checksum logic.',
    constraints: ['Input is an 8-bit value', 'Do not use built-in parity helpers'],
    examples: [
      { input: '0b10101010', output: '1', explanation: 'This pattern contains four set bits, so parity is even.' },
      { input: '0b10000001', output: '0', explanation: 'Two bits are set in this value, which is even; wait, check carefully: this is actually even parity. Use the example with odd parity to validate.' },
      { input: '0b10000000', output: '0', explanation: 'Only one bit is set, so the parity is odd.' },
    ],
    starterCode: `#include <stdint.h>

uint8_t is_even_parity(uint8_t value) {
    uint8_t parity = 0;
    while (value != 0) {
        parity ^= (value & 1u);
        value >>= 1;
    }
    return parity == 0;
}`,
    testCases: [
      { input: [0b10101010], expected: 1 },
      { input: [0b10000001], expected: 1 },
      { input: [0b10000000], expected: 0 },
      { input: [0], expected: 1 },
    ],
    explanation: 'Toggle parity every time a 1 bit is seen. After processing all bits, a 0 parity result means the value has an even number of set bits. This pattern is frequently used in UART status and data-integrity logic.',
    referenceAnswer: `uint8_t is_even_parity(uint8_t value) {
    uint8_t parity = 0;
    while (value != 0) {
        parity ^= (value & 1u);
        value >>= 1;
    }
    return parity == 0;
}`,
  },
  {
    id: 4,
    title: 'Average three ADC readings',
    difficulty: 'Medium',
    time: '20 min',
    type: 'Embedded C',
    functionName: 'average_three',
    summary: 'Smooth noisy sensor readings by computing the average of three ADC samples.',
    prompt: 'Write a function that returns the average of three 16-bit analog readings. Embedded systems often take multiple samples before making decisions on noisy inputs.',
    constraints: ['Use integer arithmetic', 'Each ADC value is between 0 and 65535'],
    examples: [
      { input: '10, 20, 30', output: '20', explanation: 'The arithmetic average is 20.' },
      { input: '100, 100, 100', output: '100', explanation: 'All values are the same.' },
      { input: '7, 9, 11', output: '9', explanation: 'The result is 9 with integer division.' },
    ],
    starterCode: `#include <stdint.h>

uint16_t average_three(uint16_t a, uint16_t b, uint16_t c) {
    uint32_t sum = (uint32_t)a + (uint32_t)b + (uint32_t)c;
    return (uint16_t)(sum / 3u);
}`,
    testCases: [
      { input: [10, 20, 30], expected: 20 },
      { input: [100, 100, 100], expected: 100 },
      { input: [7, 9, 11], expected: 9 },
      { input: [0, 0, 1], expected: 0 },
    ],
    explanation: 'Summing in 32-bit space prevents overflow when values are large. Integer division then returns the average in a stable, predictable embedded-friendly form. This is used to reduce ADC jitter before thresholding sensor data.',
    referenceAnswer: `uint16_t average_three(uint16_t a, uint16_t b, uint16_t c) {
    uint32_t total = (uint32_t)a + b + c;
    return (uint16_t)(total / 3u);
}`,
  },
  {
    id: 5,
    title: 'Map duty cycle to a percentage',
    difficulty: 'Medium',
    time: '22 min',
    type: 'Embedded C',
    functionName: 'duty_cycle_percent',
    summary: 'Compute the PWM duty cycle percentage given the on-time and total period.',
    prompt: 'A PWM wave has a high-time duration and a total period. Return the duty cycle as a percentage rounded down to the nearest integer. This is commonly used when configuring timers and motor control output.',
    constraints: ['high_time and period are positive integers', 'Return a percentage in the range 0 to 100'],
    examples: [
      { input: '25,100', output: '25', explanation: '25 out of 100 is a 25% duty cycle.' },
      { input: '1,10', output: '10', explanation: '1/10 = 10%.' },
      { input: '3,8', output: '37', explanation: '3/8 = 37.5%, so floor to 37.' },
    ],
    starterCode: `#include <stdint.h>

uint8_t duty_cycle_percent(uint8_t high_time, uint8_t period) {
    if (period == 0) {
        return 0;
    }
    return (uint8_t)((uint16_t)high_time * 100u / period);
}`,
    testCases: [
      { input: [25, 100], expected: 25 },
      { input: [1, 10], expected: 10 },
      { input: [3, 8], expected: 37 },
      { input: [0, 10], expected: 0 },
    ],
    explanation: 'The duty cycle is the fraction of time the signal is high during one full period. Multiplying by 100 before division preserves the correct integer percentage and avoids rounding up incorrectly. This is a core timer and PWM calculation used in embedded control systems.',
    referenceAnswer: `uint8_t duty_cycle_percent(uint8_t high_time, uint8_t period) {
    if (period == 0) {
        return 0;
    }
    return (uint8_t)((uint16_t)high_time * 100u / period);
}`,
  },
];
