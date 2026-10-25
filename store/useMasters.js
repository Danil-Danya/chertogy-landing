import { defineStore } from 'pinia';
import { getAllMasters, getOneMasterBySlug, updateMaster } from '@/api/masters.js';

export const useMastersStore = defineStore('masters', {
    state: () => ({
        allMasters: {
            rows: [],
        },
        oneMaster: {},
    }),

    actions: {
        async fetchAllMasters(page = 1, limit = 10, settings = [], append = false, includeHidden = false) {
            try {
                const data = await getAllMasters(page, limit, settings, includeHidden);

                if (!data) {
                    return false;
                }

                if (append) {
                    this.allMasters = {
                        ...data,
                        rows: [
                            ...(this.allMasters?.rows || []),
                            ...(data.rows || [])
                        ]
                    };
                }
                else {
                    this.allMasters = data;
                }

                return this.allMasters;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        },

        async fetchOneMaster(slug) {
            try {
                const data = await getOneMasterBySlug(slug);
                this.oneMaster = data || {};
            }
            catch (error) {
                console.log(error);
            }
        },

        async updateMasterVisibility(id, isVisible) {
            try {
                const data = await updateMaster(id, { isVisible });

                if (!data) {
                    return false;
                }

                const master = this.allMasters?.rows?.find((item) => item.id === id);

                if (master) {
                    master.isVisible = data.isVisible;
                }

                return data;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }
    }
});
