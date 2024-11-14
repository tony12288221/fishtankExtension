(function loadFullscreenScript(retries = 3) {
    document.addEventListener("DOMContentLoaded", function () {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const videoUrl = urlParams.get('url');
            const title = urlParams.get('title');
            const togglesString = urlParams.get('toggles');
            const columnNum = urlParams.get('columns');
            const videoorderString = urlParams.get('videoOrder');

            const doors = [
                { room: "Bedroom 3", to: "Vanity", points: [0.8220, 0.9895, 0.8909, 0.7543, 0.9277, 0.5918, 0.9611, 0.3614, 0.9714, 0.2316, 0.9809, 0.0667, 0.9932, 0.0728, 0.9939, 0.4887, 0.9461, 0.7276, 0.8731, 0.9665, 0.8643, 0.9871] },
                { room: "Bedroom 3", to: "Hallway", points: [0.8158, 0.4839, 0.8411, 0.0885, 0.9277, 0.1334, 0.8888, 0.5251] },
                { room: "Bedroom 2", to: "Hallway", points: [0.9161, 0.6088, 0.9768, 0.1673, 0.8799, 0.0994, 0.8281, 0.5372] },
                { room: "Bedroom 1", to: "Hallway", points: [0.0123, 0.1892, 0.1085, 0.1176, 0.1596, 0.5675, 0.0771, 0.6306] },
                { room: "Kitchen", to: "Island", points: [0.3738, 0.2037, 0.4495, 0.2098, 0.5211, 0.2013, 0.5355, 0.1734, 0.5157, 0.1601, 0.4543, 0.1455, 0.3895, 0.1528, 0.3520, 0.1771] },
                { room: "Island", to: "Hallway", points: [0.1930, 0.4184, 0.1589, 0.0012, 0.0805, 0.0036, 0.0907, 0.2328, 0.1016, 0.3602, 0.1194, 0.5166] },
                { room: "Dining Room", to: "Den", points: [0.9277, 0.6973, 0.8070, 0.5299, 0.8527, 0.1795, 0.9918, 0.2874, 0.9925, 0.3759, 0.9939, 0.3796, 0.9714, 0.5130] },
                { room: "Den", to: "Lounge", points: [0.1569, 0.3044, 0.1364, 0.0594, 0.2040, 0.0279, 0.2074, 0.2571] },
                { room: "Lounge", to: "Den", points: [0.4127, 0.0000, 0.3486, -0.0012, 0.3349, 0.2340, 0.3008, 0.2425, 0.3608, 0.2874, 0.3943, 0.2874] },
                { room: "Lounge", to: "Confessional", points: [0.7960, 0.2559, 0.7742, 0.2401, 0.7872, 0.1407, 0.8076, 0.1528] },
                { room: "Lounge", to: "Dining Room", points: [0.8458, 0.2850, 0.8574, 0.1843, 0.8970, 0.2122, 0.8820, 0.3189] },
                { room: "Locker Room", to: "Den", points: [0.4188, 0.3929, 0.4434, 0.0000, 0.2224, 0.0000, 0.2258, 0.2086, 0.2340, 0.3638, 0.2456, 0.5130] },
                { room: "Mail Room", to: "Catwalk", points: [0.0512, 0.4560, 0.1201, 0.4317, 0.1078, 0.2522, 0.1030, 0.1067, 0.1023, 0.0376, 0.0293, 0.0728, 0.0327, 0.2340] },
                { room: "Yard", to: "Flat", points: [0.9563, 0.4208, 0.9789, 0.1977, 0.9250, 0.1637, 0.9052, 0.3844] },
                { room: "Penthouse", to: "Deck", points: [0.3895, 0.2801, 0.3868, 0.0109, 0.2995, 0.0291, 0.3090, 0.3408] },
                { room: "Jacuzzi", to: "Penthouse", points: [0.6712, 0.9908, 0.7299, 0.8270, 0.7783, 0.6815, 0.8151, 0.5457, 0.8486, 0.3978, 0.8806, 0.2304, 0.8895, 0.1807, 0.9939, 0.2801, 0.9932, 0.6912, 0.8704, 0.9847] },
                { room: "Island", to: "Mail Room", points: [0.5757, 0.0036, 0.6508, 0.0194, 0.7244, 0.0424, 0.7183, 0.1795, 0.7121, 0.3007, 0.7026, 0.4196, 0.6037, 0.3371, 0.6085, 0.2607, 0.6091, 0.2231, 0.5703, 0.2001] },
                { room: "Vanity", to: "Bedroom 3", points: [0.4625, 0.5130, 0.3370, 0.5700, 0.3342, 0.5542, 0.3302, 0.5566, 0.3001, 0.3395, 0.2674, 0.0000, 0.4461, -0.0012, 0.4516, 0.2498, 0.4625, 0.4851] },
                { room: "Island", to: "Kitchen", points: [0.4319, -0.0009, 0.4280, 0.1853, 0.5007, 0.1828, 0.5112, 0.0000] },
                { room: "Lounge", to: "Den", points: [0.7067, 0.2631, 0.7551, 0.2777, 0.8158, 0.3189, 0.8554, 0.3674, 0.7019, 0.5202, 0.6501, 0.4742, 0.5969, 0.5008, 0.6303, 0.2025, 0.6583, 0.2183, 0.6889, 0.2377, 0.7012, 0.2474] },
                { room: "Lounge", to: "Den PTZ", points: [0.9782, 0.2498, 0.9318, 0.2074, 0.9052, 0.3201, 0.9386, 0.3553, 0.9536, 0.2789, 0.9693, 0.2910] },
                { room: "Island", to: "Dining Room", points: [0.8001, 0.9908, 0.8622, 0.8016, 0.9018, 0.6367, 0.9243, 0.5324, 0.9509, 0.3626, 0.9727, 0.0449, 0.9720, 0.0000, 0.9939, 0.0024, 0.9945, 0.9908] },
                { room: "Yard PTZ", to: "Yard", points: [-0.0015, 0.9881, 0.1738, 0.7989, 0.8054, 0.8030, 0.9930, 0.9868, 0.4969, 0.9895] },
                { room: "Yard PTZ", to: "Catwalk", points: [-0.0015, -0.0041, 0.1669, 0.1429, 0.8414, 0.1429, 0.9945, -0.0027] },
                { room: "Yard PTZ", to: "Flat", points: [0.8031, 0.7894, 0.8207, 0.1375, 0.8383, 0.1375, 0.9937, -0.0027, 0.9930, 0.9745] },
                { room: "Mail Room", to: "Yard", points: [0.1776, 0.5907, 0.2611, 0.6520, 0.6140, 0.4886, 0.4088, 0.2477, 0.1592, 0.2994, 0.1692, 0.4383] },
                { room: "Kitchen", to: "Hallway", points: [0.6753, 0.3408, 0.6344, 0.3311, 0.6548, -0.0024, 0.8042, 0.0000, 0.7783, 0.3893, 0.6924, 0.3638] },
                { room: "Kitchen", to: "Mail Room", points: [0.2360, 0.3274, 0.2306, -0.0049, 0.0348, -0.0049, 0.0437, 0.2983, 0.0655, 0.4584, 0.0791, 0.5178] },
                { room: "Kitchen", to: "Dining Room", points: [0.4202, 0.1370, 0.4222, -0.0024, 0.3213, -0.0061, 0.3247, 0.1564, 0.2974, 0.1807, 0.3022, 0.2862, 0.3656, 0.2086, 0.3417, 0.1819, 0.3608, 0.1564, 0.3820, 0.1419] },
                { room: "Mail Room", to: "Island", points: [0.4359, 0.8659, 0.5232, 0.8040, 0.5894, 0.9265, 0.6262, 0.9883, 0.2565, 0.9859, 0.2585, 0.9701, 0.3342, 0.9229] },
                { room: "Mail Room", to: "Kitchen", points: [-0.0020, 0.0885, 0.0089, 0.0825, 0.0334, 0.4487, 0.0416, 0.4717, 0.0512, 0.4657, 0.0273, 0.9447, 0.0000, 0.9483] },
                { room: "Den", to: "Den PTZ", points: [-0.0027, 0.1273, -0.0020, 0.4293, -0.0020, 0.8562, 0.0771, 0.8537, 0.0709, 0.1128, -0.0014, -0.0012] },
                { room: "Den", to: "Dining Room", points: [0.9905, 0.6427, 0.9918, 0.4632, 0.8506, 0.4560, 0.8506, 0.6379] },
                { room: "Den", to: "Confessional", points: [0.8465, 0.4354, 0.9870, 0.4378, 0.9857, 0.2486, 0.8431, 0.2486] },
                { room: "Den", to: "Locker Room", points: [0.9891, 0.6573, 0.8452, 0.6524, 0.8452, 0.8513, 0.9816, 0.8501, 0.9864, 0.8440] },
                { room: "Den", to: "Deck", points: [0.6344, 0.3092, 0.6323, 0.1758, 0.6480, 0.0582, 0.5778, 0.0546, 0.5621, -0.0049, 0.7387, -0.0036, 0.7258, 0.3274] },
                { room: "Den", to: "Flat", points: [0.5450, 0.2874, 0.5171, 0.3408, 0.5778, 0.4208, 0.6241, 0.3056, 0.6255, 0.1722, 0.6351, 0.0958, 0.5709, 0.0812, 0.5716, 0.2874] },
                { room: "Locker Room", to: "Catwalk", points: [0.0293, 0.0594, 0.0941, 0.0303, 0.1037, 0.1540, 0.1276, 0.4087, 0.1548, 0.5590, 0.0982, 0.6039, 0.1050, 0.6476, 0.1310, 0.7785, 0.1426, 0.8234, -0.0014, 0.8186, -0.0014, 0.3505] },
                { room: "Locker Room", to: "Dining Room", points: [0.5975, 0.5154, 0.6889, -0.0036, 0.8752, -0.0061, 0.9563, 0.0703, 0.7715, 0.7410] },
                { room: "Catwalk", to: "Kitchen", points: [0.1883, 0.0194, 0.1944, 0.1795, 0.3213, 0.1140, 0.3527, 0.1128, 0.3970, 0.1261, 0.4181, 0.1152, 0.4175, -0.0061, 0.2340, -0.0061] },
                { room: "Catwalk", to: "Yard PTZ", points: [0.3145, 0.1576, 0.3295, 0.1492, 0.3574, 0.1431, 0.3623, 0.2056, 0.3650, 0.2190, 0.3499, 0.2262, 0.3444, 0.2655, 0.3247, 0.3198, 0.2945, 0.4024, 0.2794, 0.3939] },
                { room: "Catwalk", to: "Yard", points: [0.2824, 0.2753, 0.3697, 0.2741, 0.7381, 0.5372, 0.4986, 0.8986, 0.2306, 0.4948, 0.1658, 0.3614] },
                { room: "Flat", to: "Den", points: [0.8226, 0.3153, 0.9065, 0.3529, 0.9209, 0.2110, 0.9202, 0.0327, 0.8302, -0.0085, 0.7729, -0.0073, 0.7810, 0.0364, 0.8438, 0.0558, 0.8315, 0.1625] },
                { room: "Flat", to: "Bar", points: [0.9918, 0.2280, 0.9216, 0.3299, 0.9018, 0.3868, 0.8984, 0.5882, 0.9945, 0.5869, 0.9932, 0.2231] },
                { room: "Bar", to: "Den", points: [0.5716, 0.2037, 0.6508, 0.2607, 0.6774, 0.2413, 0.7531, -0.0061, 0.5935, -0.0073, 0.5764, 0.0352, 0.5634, 0.0412] },
                { room: "Bar", to: "Flat", points: [0.6432, 0.2632, 0.5614, 0.2037, 0.5593, 0.1310, 0.5477, 0.1298, 0.5498, 0.0922, 0.3909, 0.0327, 0.3663, 0.0485, 0.3533, 0.0424, 0.2804, 0.0922, 0.2797, 0.0982, 0.1589, 0.1952, 0.1289, 0.2074, 0.0396, 0.3032, 0.0082, 0.6900, 0.2810, 0.3965, 0.4297, 0.2632, 0.4768, 0.2886, 0.5348, 0.2765, 0.5832, 0.2644, 0.6166, 0.2632] },
                { room: "Bar", to: "Yard", points: [0.2183, 0.4608, 0.2299, 0.4839, 0.1828, 0.5506, 0.1187, 0.6633, 0.0784, 0.7773, 0.0621, 0.8355, 0.0014, 0.8489, 0.0007, 0.7034, 0.1037, 0.5809] },
                { room: "Loft", to: "Penthouse", points: [0.3452, 0.6197, 0.2810, 0.5821, 0.1228, 0.8562, 0.1726, 0.9410] },
                { room: "Loft", to: "Jacuzzi", points: [0.2360, 0.2971, 0.2237, 0.1758, -0.0020, 0.4184, -0.0034, 0.5991] },
                { room: "Loft", to: "Deck", points: [0.5648, 0.2462, 0.5716, -0.0024, 0.7885, -0.0073, 0.7735, 0.2049] },
                { room: "Confessional", to: "Dining Room", points: [0.9939, 0.8416, 0.8888, 0.8477, 0.9086, 0.1370, 0.9939, -0.0061] },
                { room: "Confessional", to: "Den", points: [-0.0020, -0.0036, 0.0880, 0.1273, 0.0784, 0.8574, -0.0014, 0.8525] },
                { room: "Penthouse", to: "Jacuzzi", points: [-0.0007, -0.0012, 0.0819, 0.1722, 0.0887, 0.8198, -0.0034, 0.8222] },
                { room: "Hallway", to: "Island", points: [0.3622, 0.7895, 0.5689, 0.7882, 0.5894, 0.9871, 0.3411, 0.9883] },
                { room: "Hallway", to: "Bedroom 1", points: [0.3704, 0.5372, 0.3643, 0.0340, 0.1651, 0.1831, 0.1842, 0.8986, 0.2490, 0.8840, 0.2476, 0.9883, 0.3220, 0.9896, 0.3636, 0.6609] },
                { room: "Hallway", to: "Bedroom 2", points: [0.3806, 0.0170, 0.3854, 0.4802, 0.3950, 0.4208, 0.4366, 0.4123, 0.4434, 0.0061, 0.3970, 0.0000] },
                { room: "Hallway", to: "Bedroom 3", points: [0.5252, 0.4135, 0.5348, 0.0049, 0.5662, 0.0061, 0.8076, 0.2729, 0.6978, 0.9132, 0.6276, 0.8853, 0.6037, 0.9544, 0.5641, 0.6318, 0.5505, 0.5433, 0.5450, 0.4972, 0.5477, 0.4729, 0.5246, 0.4729] },
                { room: "Dining Room", to: "Mail Room", points: [0.1412, 0.0618, 0.1542, 0.4523, 0.2558, 0.4402, 0.2538, 0.0291, 0.1910, 0.0449] },
                { room: "Dining Room", to: "Island", points: [-0.0027, -0.0073, 0.0600, 0.0861, 0.0771, 0.8368, -0.0014, 0.8295] },
                { room: "Dining Room", to: "Kitchen", points: [0.0628, 0.0703, 0.1330, 0.0546, 0.1473, 0.4426, 0.0703, 0.4463] },
                { room: "Penthouse", to: "Loft", points: [0.7005, 0.4535, 0.7442, 0.4620, 0.7415, 0.4184, 0.7735, 0.4123, 0.7769, 0.3711, 0.7954, 0.3590, 0.8001, 0.3020, 0.8098, 0.3017, 0.8139, 0.2729, 0.8220, 0.2656, 0.8213, 0.1967, 0.8162, 0.1479, 0.8196, 0.1420, 0.8021, 0.0966, 0.7415, 0.0382, 0.7368, 0.0024] },
                { room: "Deck", to: "Den", points: [0.6569, 0.3784, 0.7285, 0.4366, 0.2285, 0.8634, 0.1883, 0.6730] },
                { room: "Den PTZ", to: "Deck", points: [-0.0027, -0.0036, 0.2087, 0.1831, 0.7844, 0.1916, 0.9932, -0.0036] },
                { room: "Den PTZ", to: "Den", points: [0.9932, -0.0061, 0.7844, 0.1892, 0.8008, 0.8404, 0.9939, 0.8574] },
                { room: "Den PTZ", to: "Lounge", points: [0.2026, 0.1783, 0.1855, 0.8598, -0.0027, 0.8549, -0.0027, -0.0024] },
                { room: "Catwalk", to: "Locker Room", points: [0.0955, 0.2547, 0.0846, 0.1031, 0.0450, 0.1249, 0.0675, 0.2704] },
                { room: "Yard", to: "Catwalk", points: [-0.0027, -0.0036, 0.1603, 0.1795, 0.4018, 0.1771, 0.3970, -0.0024] },
                { room: "Yard", to: "Yard PTZ", points: [0.3970, -0.0049, 0.4018, 0.1698, 0.5362, 0.1722, 0.5348, -0.0061] },
                { room: "Yard", to: "Catwalk", points: [0.5327, -0.0049, 0.5348, 0.1686, 0.8724, 0.1674, 0.9918, -0.0012] },
                { room: "Jacuzzi", to: "Loft", points: [0.9911, 0.1152, 0.8424, -0.0012, 0.9939, -0.0012, 0.9939, 0.1104] },
                { room: "Deck", to: "Penthouse", points: [0.2292, 0.9847, 0.2196, 0.9519, 0.2080, 0.9374, 0.1671, 0.8113, 0.0969, 0.5312, 0.0587, 0.2862, 0.0464, 0.0934, -0.0014, 0.1419, 0.0007, 0.9871] },
                { room: "Flat", to: "Yard", points: [0.9945, 0.5918, 0.7387, 0.5991, 0.4918, 0.9871, 0.9939, 0.9908] }
            ];

            const streams = [
                { title: "Director Mode", url: "https://ft.3045x.com/9b249j7qlqu0fypg/index.m3u8" },
                { title: "Den", url: "https://ft.3045x.com/d678xcnkn2slngkx/index.m3u8" },
                { title: "Den PTZ", url: "https://ft.3045x.com/8e1arf44e86qa7ru/index.m3u8" },
                { title: "Lounge", url: "https://ft.3045x.com/9f41r40060icglir/index.m3u8" },
                { title: "Locker Room", url: "https://ft.3045x.com/7d3e7e9s5qm5l1uf/index.m3u8" },
                { title: "Deck", url: "https://ft.3045x.com/b4e4iknxyd1u4g0c/index.m3u8" },
                { title: "Yard", url: "https://ft.3045x.com/8ac015orral0pm4c/index.m3u8" },
                { title: "Yard PTZ", url: "https://ft.3045x.com/b51399w8tr5qa0v1/index.m3u8" },
                { title: "Catwalk", url: "https://ft.3045x.com/580elsslerqmt28u/index.m3u8" },
                { title: "Mail Room", url: "https://ft.3045x.com/84485q0ve58ckwm2/index.m3u8" },
                { title: "Kitchen", url: "https://ft.3045x.com/8c8btla37r6nux8f/index.m3u8" },
                { title: "Island", url: "https://ft.3045x.com/d578z2acldqyww5x/index.m3u8" },
                { title: "Dining Room", url: "https://ft.3045x.com/afacw5eipuyfsfny/index.m3u8" },
                { title: "Hallway", url: "https://ft.3045x.com/3760543f053u6c5m/index.m3u8" },
                { title: "Bedroom 1", url: "https://ft.3045x.com/b65269ekvyvfkous/index.m3u8" },
                { title: "Bedroom 2", url: "https://ft.3045x.com/36708jd80gr91018/index.m3u8" },
                { title: "Bedroom 3", url: "https://ft.3045x.com/44daqjc6r1dfxd2e/index.m3u8" },
                { title: "Vanity", url: "https://ft.3045x.com/68f8q4hl8cys37n2/index.m3u8" },
                { title: "Penthouse", url: "https://ft.3045x.com/0c0bun9tebd65k3j/index.m3u8" },
                { title: "Loft", url: "https://ft.3045x.com/9d5ckl8snb01ba6i/index.m3u8" },
                { title: "Jacuzzi", url: "https://ft.3045x.com/122bkgvyrj1f7pk4/index.m3u8" },
                { title: "Bar", url: "https://ft.3045x.com/f77b5hz939s8z89b/index.m3u8" },
                { title: "Flat", url: "https://ft.3045x.com/4fb8to1674q6ht0m/index.m3u8" },
                { title: "Confessional", url: "https://ft.3045x.com/21aflvcz5puavd2e/index.m3u8" },
            ];

            const proxyUrl = 'https://corsproxy.io/?';

            // Parse the toggles parameter
            let toggleStates = [];
            if (togglesString) {
                toggleStates = togglesString.split(',').map(toggle => toggle.trim() === 'true');
            }

            let videoorder = [];
            if (videoorder) {
                videoorder = videoorderString.split(',');
                videoWrapperIDs = indexFromvideoWrapper();
            }

            let buttonUpdated = false;

            // Filter active streams based on toggle states
            //const activeStreams = streams.filter((_, index) => toggleStates[index]);
            const activeStreams = videoWrapperIDs.map(index => streams[index]);
            currentIndex = activeStreams.findIndex(stream => stream.url === videoUrl);
            let previousVideoTitle = "";

            let currentStream = activeStreams[currentIndex];


            const video = document.getElementById('fullscreenVideo');
            let hls; // Declare HLS instance globally

            // Set the title in the document
            if (title) {
                document.getElementById('fullscreenTitle').textContent = title;
            }

            function indexFromvideoWrapper() {
                const videoNumbers = videoorder.map(wrapper => {
                    const match = wrapper.match(/\d+/); // Match one or more digits
                    return match ? parseInt(match[0], 10) : null; // Convert to integer or return null if no match
                }).filter(num => num !== null); // Filter out any null values
                return videoNumbers
            }

            function loadVideo(index) {
                // Cleanup previous HLS instance if it exists
                if (hls) {
                    hls.destroy(); // Destroy previous instance
                }

                // Adjust the index to wrap around cyclically
                if (index >= activeStreams.length) {
                    index = 0; // If index exceeds the length, go back to the first stream
                } else if (index < 0) {
                    index = activeStreams.length - 1; // If index is negative, go to the last stream
                }

                if (index >= 0 && index < activeStreams.length) {
                    const stream = activeStreams[index];
                    hls = new Hls({
                        maxBufferLength: 20,
                        capLevelToPlayerSize: true,
                        minLevel: 1 // Adjust according to your stream quality levels
                    });
                    let url = proxyUrl + stream.url;
                    setTimeout(() => {
                        hls.loadSource(url);  // Load the source after a delay
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
                    }, 20);
                    document.getElementById('fullscreenTitle').textContent = stream.title;
                } else {
                    alert("Invalid video index.");
                }
            }

            function loadVideobyURL(stream) {
                // Cleanup previous HLS instance if it exists
                if (hls) {
                    hls.destroy(); // Destroy previous instance
                }

                if (!stream || !stream.url) {
                    console.error("Invalid stream or missing URL:", stream);
                    return; // Exit the function if the stream is invalid
                }

                hls = new Hls({
                    maxBufferLength: 20,
                    capLevelToPlayerSize: true,
                    minLevel: 1 // Adjust according to your stream quality levels
                });
                let url = proxyUrl + stream.url;
                setTimeout(() => {
                    hls.loadSource(url);  // Load the source after a delay
                    hls.attachMedia(video);
                    hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
                }, 20);
                document.getElementById('fullscreenTitle').textContent = stream.title;
            }

            function updateURL(currentIndex) {
                const params = new URLSearchParams(window.location.search);
                console.log(currentIndex)
                const stream = activeStreams[currentIndex];

                params.set('url', stream.url);
                params.set('title', stream.title)
                params.set('toggles', toggleStates);
                params.set('columns', columnNum);
                params.set('videoOrder', videoorder);
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                history.replaceState({}, '', newUrl);
            }

            function updateURLfromPolygon(currentStream) {
                const params = new URLSearchParams(window.location.search);
                params.set('url', currentStream.url);
                params.set('title', currentStream.title)
                params.set('toggles', toggleStates);
                params.set('columns', columnNum);
                params.set('videoOrder', videoorder);
                const newUrl = `${window.location.pathname}?${params.toString()}`;
                history.replaceState({}, '', newUrl);
            }

            function drawPolygon(stream_for_polygon) {
                const videoContainer = document.getElementById("videoContainer");
                const matchingDoors = doors.filter(door => door.room === stream_for_polygon.title);

                // Remove previously drawn polygons (but not the SVGs)
                const existingPolygons = document.querySelectorAll("#videoContainer svg");
                existingPolygons.forEach(poly => poly.remove());

                // Create a separate SVG for each door that has a polygon
                matchingDoors.forEach(door => {
                    if (!door || !door.points) return;

                    const points = door.points;
                    const svgWidth = videoContainer.clientWidth;
                    const svgHeight = videoContainer.clientHeight;

                    // Create the polygon element
                    const scaledPoints = points.map((value, idx) => {
                        const size = idx % 2 === 0 ? svgWidth : svgHeight;
                        return value * size;
                    });

                    const pointsAttribute = scaledPoints.reduce((acc, point, idx) => {
                        return idx % 2 === 0 ? acc + `${point},` : acc + `${point} `;
                    }, "").trim();

                    // Create an individual SVG for each polygon
                    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svg.setAttribute("class", "polygon-svg");

                    // Calculate bounding box for the polygon
                    const minX = Math.min(...scaledPoints.filter((_, idx) => idx % 2 === 0));
                    const minY = Math.min(...scaledPoints.filter((_, idx) => idx % 2 !== 0));
                    const maxX = Math.max(...scaledPoints.filter((_, idx) => idx % 2 === 0));
                    const maxY = Math.max(...scaledPoints.filter((_, idx) => idx % 2 !== 0));

                    const width = maxX - minX;
                    const height = maxY - minY;

                    // Set SVG size based on the bounding box of the polygon
                    svg.setAttribute("width", width);
                    svg.setAttribute("height", height);
                    svg.setAttribute("style", `position: absolute; top: 0px; left: 0px; pointer-events: none;`);

                    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                    polygon.setAttribute("points", pointsAttribute);
                    polygon.setAttribute("class", "polygon-area");
                    polygon.setAttribute("data-room", door.room);
                    polygon.setAttribute("data-to", door.to);
                    polygon.setAttribute("fill", "rgba(255, 0, 0, 0.3)");
                    polygon.setAttribute("stroke", "rgba(255, 0, 0, 0.5)");
                    polygon.setAttribute("stroke-width", 1);
                    polygon.style.cursor = "pointer";

                    // Event listeners for polygon interaction
                    polygon.addEventListener('click', () => {
                        if (!buttonUpdated) {
                            updatePreviousVideoTitle(stream_for_polygon.title);
                            buttonUpdated = true;
                        }
                        const nextStream = streams.filter(stream => stream.title === door.to);
                        loadVideobyURL(nextStream[0]);
                        //updateURLfromPolygon(nextStream[0]);
                        drawPolygon(nextStream[0]);
                    });

                    polygon.addEventListener('mousemove', () => {
                        polygon.setAttribute("fill", 'rgba(255, 0, 0, 0.7)');
                        polygon.setAttribute("stroke", 'rgba(255, 0, 0, 0.9)');
                    });

                    polygon.addEventListener('mouseleave', () => {
                        polygon.setAttribute("fill", "rgba(255, 0, 0, 0.3)");
                        polygon.setAttribute("stroke", "rgba(255, 0, 0, 0.5)");
                    });

                    // Calculate the centroid of the polygon for placing the text
                    const centroidX = scaledPoints.filter((_, idx) => idx % 2 === 0).reduce((acc, x) => acc + x, 0) / (scaledPoints.length / 2);
                    const centroidY = scaledPoints.filter((_, idx) => idx % 2 !== 0).reduce((acc, y) => acc + y, 0) / (scaledPoints.length / 2);

                    // Create the text element
                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", centroidX);
                    text.setAttribute("y", centroidY);
                    text.setAttribute("class", "polygon-text");
                    text.setAttribute("fill", "white");
                    text.setAttribute("font-size", "16");
                    text.setAttribute("text-anchor", "middle");
                    text.textContent = door.to;

                    // Append polygon to the SVG
                    svg.appendChild(polygon);
                    svg.appendChild(text);
                    videoContainer.appendChild(svg); // Append the individual SVG to the video container
                });
            }


            function updatePreviousVideoTitle(title) {
                previousVideoTitle = title; // Store the previous title
                document.getElementById('previousTitle').textContent = previousVideoTitle; // Update the button text
                document.getElementById('returnButton').style.display = 'block'; // Show the button
                document.getElementById('rightButton').style.display = 'none';
                document.getElementById('leftButton').style.display = 'none';
            }

            // Load the initial video
            loadVideobyURL(currentStream);
            drawPolygon(currentStream);
            updateURLfromPolygon(currentStream);

            // Add event listeners for the navigation buttons
            document.querySelector('.left-button').addEventListener('click', function () {
                video.pause(); // Pause the video before redirecting
                currentIndex = (currentIndex - 1 + activeStreams.length) % activeStreams.length; // Cycle left
                loadVideo(currentIndex);
                const stream_for_polygon = activeStreams[currentIndex];
                drawPolygon(stream_for_polygon);
                updateURL(currentIndex);
            });

            document.querySelector('.right-button').addEventListener('click', function () {
                video.pause(); // Pause the video before redirecting
                currentIndex = (currentIndex + 1) % activeStreams.length; // Cycle right
                loadVideo(currentIndex);
                const stream_for_polygon = activeStreams[currentIndex];
                drawPolygon(stream_for_polygon);
                updateURL(currentIndex);
            });

            // Add event listener for the exit button
            document.querySelector('.exit-button').addEventListener('click', function () {
                video.pause(); // Pause the video before redirecting
                setTimeout(() => {
                    const prevToggles = toggleStates.map((state, index) => (state ? 'true' : 'false')).join(',');
                    window.location.href = `player.html?toggles=${prevToggles}&columns=${columnNum}&videoOrder=${videoorder}&currentVideo=${previousVideoTitle}`; // Redirect back to the main player page with previous toggle states        
                }, 100);
            });

            document.getElementById('polygon-toggle').addEventListener('change', function (event) {
                const polygons = document.querySelectorAll('.polygon-area');
                const polygonsText = document.querySelectorAll('.polygon-text');
                const toggleOn = event.target.checked;

                polygons.forEach(polygon => {
                    // Set visibility and clickability based on toggle state
                    if (toggleOn) {
                        polygon.style.display = 'inline'; // Make visible
                        polygon.style.pointerEvents = 'auto'; // Enable clicking
                    } else {
                        polygon.style.display = 'none'; // Hide polygons
                        polygon.style.pointerEvents = 'none'; // Disable clicking
                    }
                });
                polygonsText.forEach(text => {
                    if (toggleOn) {
                        text.style.display = 'inline'; // Make visible
                    } else {
                        text.style.display = 'none'; // Hide polygons
                    }
                });
            });

            // Add event listener for the exit button
            document.querySelector('.return-button').addEventListener('click', function () {
                video.pause(); // Pause the video before redirecting
                buttonUpdated = false;
                document.getElementById('rightButton').style.display = 'block';
                document.getElementById('leftButton').style.display = 'block';
                document.getElementById('returnButton').style.display = 'none';
                backVideoTitle = document.getElementById('previousTitle').textContent;
                let currentIndex = activeStreams.findIndex(stream => stream.title === backVideoTitle);
                loadVideo(currentIndex);
                updateURL(currentIndex);
                const stream_for_polygon = activeStreams[currentIndex];
                drawPolygon(stream_for_polygon);
                // Ensure the polygon toggle is set to "on" when the return button is clicked
                document.getElementById('polygon-toggle').checked = true; // Set the toggle to "on"
                // Optionally trigger the 'change' event to update the visibility and clickability of polygons immediately
                document.getElementById('polygon-toggle').dispatchEvent(new Event('change'));
            });

            // Add keyboard navigation
            document.addEventListener('keydown', function (event) {
                switch (event.key) {
                    case 'ArrowLeft':
                    case 'ArrowRight':
                        // Apply condition only for ArrowLeft and ArrowRight keys
                        if (!buttonUpdated) {
                            // Trigger left or right button functionality
                            if (event.key === 'ArrowLeft') {
                                document.querySelector('.left-button').click();
                            } else if (event.key === 'ArrowRight') {
                                document.querySelector('.right-button').click();
                            }
                        }
                        break;
                    case 'Escape':
                        // Trigger exit button functionality without the condition
                        document.querySelector('.exit-button').click();
                        break;
                }
            });
        } catch (error) {
            //console.error("Error in fullscreen.js execution:", error);
            if (retries > 0) {
                //console.log(`Retrying fullscreen.js... (${retries} attempts left)`);
                setTimeout(() => loadFullscreenScript(retries - 1), 1000); // Retry after 1 second
            } else {
                console.error("Failed to execute fullscreen.js after multiple attempts.");
            }
        }
    });
})();