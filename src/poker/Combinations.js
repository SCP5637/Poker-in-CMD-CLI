/**
 * 组合计算工具类
 * 用于计算一组牌的所有可能组合
 */
export class Combinations {
    /**
     * 生成所有可能的组合
     * @param {Array} array - 要生成组合的数组
     * @param {number} r - 每个组合中的元素数量
     * @returns {Array<Array>} 所有可能的组合数组
     */
    static generate(array, r) {
        if (r > array.length) return [];
        if (r === 0) return [[]];
        if (r === array.length) return [array];

        const combinations = [];
        const firstElement = array[0];
        const restArray = array.slice(1);

        // 包含第一个元素的组合
        const combsWithFirst = Combinations.generate(restArray, r - 1);
        combsWithFirst.forEach(comb => {
            combinations.push([firstElement, ...comb]);
        });

        // 不包含第一个元素的组合
        const combsWithoutFirst = Combinations.generate(restArray, r);
        combsWithoutFirst.forEach(comb => {
            combinations.push(comb);
        });

        return combinations;
    }

    /**
     * 生成所有可能的子集（包括空集和全集）
     * @param {Array} array - 要生成子集的数组
     * @returns {Array<Array>} 所有可能的子集数组
     */
    static generateSubsets(array) {
        const subsets = [[]];
        for (const element of array) {
            const currentSubsetsLength = subsets.length;
            for (let i = 0; i < currentSubsetsLength; i++) {
                subsets.push([...subsets[i], element]);
            }
        }
        return subsets;
    }

    /**
     * 生成指定大小范围内的所有组合
     * @param {Array} array - 要生成组合的数组
     * @param {number} minSize - 最小组合大小
     * @param {number} maxSize - 最大组合大小
     * @returns {Array<Array>} 所有可能的组合数组
     */
    static generateInRange(array, minSize, maxSize) {
        const combinations = [];
        for (let r = minSize; r <= maxSize; r++) {
            combinations.push(...Combinations.generate(array, r));
        }
        return combinations;
    }

    /**
     * 生成所有可能的排列
     * @param {Array} array - 要生成排列的数组
     * @returns {Array<Array>} 所有可能的排列数组
     */
    static generatePermutations(array) {
        if (array.length <= 1) return [array];
        
        const permutations = [];
        const firstElement = array[0];
        const restPermutations = Combinations.generatePermutations(array.slice(1));
        
        restPermutations.forEach(perm => {
            for (let i = 0; i <= perm.length; i++) {
                const permutation = [...perm.slice(0, i), firstElement, ...perm.slice(i)];
                permutations.push(permutation);
            }
        });
        
        return permutations;
    }

    /**
     * 检查一个数组是否是另一个数组的子集
     * @param {Array} subset - 可能的子集
     * @param {Array} array - 主数组
     * @returns {boolean} 如果subset是array的子集则返回true
     */
    static isSubset(subset, array) {
        return subset.every(element => array.includes(element));
    }

    /**
     * 从数组中移除指定的元素
     * @param {Array} array - 源数组
     * @param {Array} elements - 要移除的元素数组
     * @returns {Array} 移除指定元素后的新数组
     */
    static removeElements(array, elements) {
        return array.filter(element => !elements.includes(element));
    }
}